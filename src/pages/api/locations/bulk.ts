// pages/api/locations/bulk.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Locations } from '@prisma/client'
import prisma from '@/configs/prisma/prisma'

interface BulkDeleteBody {
  locationIds: number[]
}

interface BulkCreateBody {
  locations: {
    detail: string
    province: string
  }[]
}

interface LocationInUse {
  locationId: number
  detail: string
  tripsCount: number
}

interface BulkDeleteResponse {
  success: boolean
  message?: string
  deletedCount?: number
  error?: string
  locationsInUse?: LocationInUse[]
}

interface BulkCreateResponse {
  success: boolean
  message?: string
  created?: number
  skipped?: number
  total?: number
  error?: string
  details?: string[]
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  [key: string]: any
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    switch (req.method) {
      case 'DELETE':
        return await bulkDeleteLocations(req, res)
      case 'POST':
        return await bulkCreateLocations(req, res)
      default:
        res.setHeader('Allow', ['DELETE', 'POST'])
        return res.status(405).json({
          success: false,
          error: 'Method not allowed',
        })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    })
  }
}

// DELETE /api/locations/bulk - Xóa nhiều locations
async function bulkDeleteLocations(req: NextApiRequest, res: NextApiResponse<BulkDeleteResponse>) {
  try {
    const { locationIds }: BulkDeleteBody = req.body

    if (!locationIds || !Array.isArray(locationIds) || locationIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Location IDs array is required and must not be empty',
      })
    }

    if (locationIds.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete more than 100 locations at once',
      })
    }

    // Validate all IDs are numbers
    const validIds = locationIds.filter((id) => Number.isInteger(id) && id > 0)

    if (validIds.length !== locationIds.length) {
      return res.status(400).json({
        success: false,
        error: 'All location IDs must be valid positive integers',
      })
    }

    // Remove duplicates
    const uniqueIds = [...new Set(validIds)]

    // Check which locations exist and are being used
    const locationsWithTrips = await prisma.locations.findMany({
      where: {
        locationId: { in: uniqueIds },
      },
      include: {
        tripStops: {
          include: {
            trip: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    })

    if (locationsWithTrips.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No locations found with the provided IDs',
      })
    }

    // Check for locations with active trips
    const locationsInUse: LocationInUse[] = []
    const deletableIds: number[] = []

    locationsWithTrips.forEach((location) => {
      const activeTrips = location.tripStops.filter(
        (stop) => stop.trip.status === 'upcoming' || stop.trip.status === 'ongoing',
      )

      if (activeTrips.length > 0 || location.tripStops.length > 0) {
        locationsInUse.push({
          locationId: location.locationId,
          detail: location.detail,
          tripsCount: location.tripStops.length,
        })
      } else {
        deletableIds.push(location.locationId)
      }
    })

    if (locationsInUse.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete ${locationsInUse.length} location(s) as they are being used in trips or have trip history.`,
        locationsInUse,
      })
    }

    if (deletableIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No locations can be deleted (all are in use or have trip history)',
      })
    }

    // Delete locations
    const deleteResult = await prisma.locations.deleteMany({
      where: {
        locationId: { in: deletableIds },
      },
    })

    return res.status(200).json({
      success: true,
      message: `${deleteResult.count} location(s) deleted successfully`,
      deletedCount: deleteResult.count,
    })
  } catch (error) {
    console.error('Bulk delete locations error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to delete locations',
    })
  }
}

// POST /api/locations/bulk - Tạo nhiều locations (import)
async function bulkCreateLocations(req: NextApiRequest, res: NextApiResponse<BulkCreateResponse>) {
  try {
    const { locations }: BulkCreateBody = req.body

    if (!locations || !Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Locations array is required and must not be empty',
      })
    }

    if (locations.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Cannot create more than 1000 locations at once',
      })
    }

    // Validate each location
    const validationErrors: string[] = []
    const validLocations: { detail: string; province: string }[] = []

    locations.forEach((location, index) => {
      const { detail, province } = location

      if (!detail || typeof detail !== 'string') {
        validationErrors.push(`Row ${index + 1}: Detail is required and must be a string`)
        return
      }

      if (!province || typeof province !== 'string') {
        validationErrors.push(`Row ${index + 1}: Province is required and must be a string`)
        return
      }

      const trimmedDetail = detail.trim()
      if (trimmedDetail.length < 3) {
        validationErrors.push(`Row ${index + 1}: Location name must be at least 3 characters`)
        return
      }

      if (trimmedDetail.length > 255) {
        validationErrors.push(`Row ${index + 1}: Location name must not exceed 255 characters`)
        return
      }

      validLocations.push({
        detail: trimmedDetail,
        province: province.trim(),
      })
    })

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation errors found',
        details: validationErrors,
      })
    }

    // Check for duplicates within the input data
    const duplicatesInInput: string[] = []
    const seen = new Set<string>()

    validLocations.forEach((location, index) => {
      const key = `${location.detail.toLowerCase()}-${location.province}`
      if (seen.has(key)) {
        duplicatesInInput.push(
          `Row ${index + 1}: Duplicate location "${location.detail}" in ${location.province}`,
        )
      } else {
        seen.add(key)
      }
    })

    if (duplicatesInInput.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate locations found in input data',
        details: duplicatesInInput,
      })
    }

    // Check for existing locations in database
    const existingLocations = await prisma.locations.findMany({
      where: {
        OR: validLocations.map((loc) => ({
          AND: [
            {
              detail: {
                equals: loc.detail,
                mode: 'insensitive',
              },
            },
            {
              province: loc.province,
            },
          ],
        })),
      },
    })

    const existingSet = new Set(
      existingLocations.map((loc) => `${loc.detail.toLowerCase()}-${loc.province}`),
    )

    const newLocations = validLocations.filter(
      (loc) => !existingSet.has(`${loc.detail.toLowerCase()}-${loc.province}`),
    )

    if (newLocations.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'All locations already exist in database',
      })
    }

    // Create new locations
    const createResult = await prisma.locations.createMany({
      data: newLocations,
      skipDuplicates: true,
    })

    return res.status(201).json({
      success: true,
      message: `${createResult.count} location(s) created successfully`,
      created: createResult.count,
      skipped: validLocations.length - createResult.count,
      total: validLocations.length,
    })
  } catch (error) {
    console.error('Bulk create locations error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to create locations',
    })
  }
}
