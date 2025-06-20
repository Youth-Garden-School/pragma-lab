// pages/api/locations/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Locations, TripStops, Trips } from '@prisma/client'

const prisma = new PrismaClient()

interface UpdateLocationBody {
  detail: string
  province: string
}

interface LocationWithTrips extends Locations {
  tripStops: (TripStops & {
    trip: {
      tripId: number
      status: string
      createdAt: Date
    }
  })[]
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const { id } = req.query
    
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid location ID' 
      })
    }

    const locationId = parseInt(id)

    if (isNaN(locationId) || locationId < 1) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid location ID' 
      })
    }

    switch (req.method) {
      case 'GET':
        return await getLocation(req, res, locationId)
      case 'PUT':
        return await updateLocation(req, res, locationId)
      case 'DELETE':
        return await deleteLocation(req, res, locationId)
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        return res.status(405).json({ 
          success: false, 
          error: 'Method not allowed' 
        })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    })
  } finally {
    await prisma.$disconnect()
  }
}

// GET /api/locations/[id] - Lấy thông tin location theo ID
async function getLocation(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LocationWithTrips>>,
  locationId: number
) {
  try {
    const location = await prisma.locations.findUnique({
      where: {
        locationId
      },
      include: {
        tripStops: {
          include: {
            trip: {
              select: {
                tripId: true,
                status: true,
                createdAt: true
              }
            }
          },
          orderBy: {
            trip: {
              createdAt: 'desc'
            }
          }
        }
      }
    })

    if (!location) {
      return res.status(404).json({
        success: false,
        error: 'Location not found'
      })
    }

    return res.status(200).json({
      success: true,
      data: location as LocationWithTrips
    })
  } catch (error) {
    console.error('Get location error:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch location' 
    })
  }
}

// PUT /api/locations/[id] - Cập nhật location
async function updateLocation(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Locations>>,
  locationId: number
) {
  try {
    const { detail, province }: UpdateLocationBody = req.body

    // Validation
    if (!detail || typeof detail !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Detail is required and must be a string'
      })
    }

    if (!province || typeof province !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Province is required and must be a string'
      })
    }

    const trimmedDetail = detail.trim()
    if (trimmedDetail.length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Location name must be at least 3 characters'
      })
    }

    if (trimmedDetail.length > 255) {
      return res.status(400).json({
        success: false,
        error: 'Location name must not exceed 255 characters'
      })
    }

    // Check if location exists
    const existingLocation = await prisma.locations.findUnique({
      where: { locationId }
    })

    if (!existingLocation) {
      return res.status(404).json({
        success: false,
        error: 'Location not found'
      })
    }

    // Check for duplicate (exclude current location)
    const duplicateLocation = await prisma.locations.findFirst({
      where: {
        detail: {
          equals: trimmedDetail,
          mode: 'insensitive'
        },
        province,
        NOT: {
          locationId
        }
      }
    })

    if (duplicateLocation) {
      return res.status(409).json({
        success: false,
        error: 'Location already exists in this province'
      })
    }

    // Update location
    const updatedLocation = await prisma.locations.update({
      where: { locationId },
      data: {
        detail: trimmedDetail,
        province
      }
    })

    return res.status(200).json({
      success: true,
      data: updatedLocation,
      message: 'Location updated successfully'
    })
  } catch (error) {
    console.error('Update location error:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to update location' 
    })
  }
}

// DELETE /api/locations/[id] - Xóa location
async function deleteLocation(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
  locationId: number
) {
  try {
    // Check if location exists
    const existingLocation = await prisma.locations.findUnique({
      where: { locationId },
      include: {
        tripStops: {
          include: {
            trip: {
              select: {
                status: true
              }
            }
          }
        }
      }
    })

    if (!existingLocation) {
      return res.status(404).json({
        success: false,
        error: 'Location not found'
      })
    }

    // Check if location is being used in any active trips
    const activeTrips = existingLocation.tripStops.filter(
      stop => stop.trip.status === 'upcoming' || stop.trip.status === 'ongoing'
    )

    if (activeTrips.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete location. It is being used in ${activeTrips.length} active trip(s).`
      })
    }

    // If location has completed trips, we might want to keep it for historical data
    // But for now, let's allow deletion if no active trips
    if (existingLocation.tripStops.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete location. It has trip history. Consider archiving instead.'
      })
    }

    // Delete location
    await prisma.locations.delete({
      where: { locationId }
    })

    return res.status(200).json({
      success: true,
      message: 'Location deleted successfully'
    })
  } catch (error) {
    console.error('Delete location error:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to delete location' 
    })
  }
}
