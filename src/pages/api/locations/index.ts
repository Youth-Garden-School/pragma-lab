// pages/api/locations/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Locations } from '@prisma/client'

const prisma = new PrismaClient()

interface GetLocationsQuery {
  search?: string
  province?: string
  page?: string
  limit?: string
}

interface CreateLocationBody {
  detail: string
  province: string
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    switch (req.method) {
      case 'GET':
        return await getLocations(req, res)
      case 'POST':
        return await createLocation(req, res)
      default:
        res.setHeader('Allow', ['GET', 'POST'])
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

// GET /api/locations - Lấy danh sách locations với filter và search
async function getLocations(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Locations[]>>
) {
  try {
    const { search, province, page = '1', limit = '10' } = req.query as GetLocationsQuery

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.detail = {
        contains: search,
        mode: 'insensitive'
      }
    }
    
    if (province && province !== 'All Provinces') {
      where.province = province
    }

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    // Validate pagination parameters
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid page number'
      })
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        error: 'Invalid limit (must be between 1 and 100)'
      })
    }

    // Get locations with pagination
    const [locations, total] = await Promise.all([
      prisma.locations.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: {
          locationId: 'desc'
        }
      }),
      prisma.locations.count({ where })
    ])

    return res.status(200).json({
      success: true,
      data: locations,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    console.error('Get locations error:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch locations' 
    })
  }
}

// POST /api/locations - Tạo location mới
async function createLocation(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Locations>>
) {
  try {
    const { detail, province }: CreateLocationBody = req.body

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

    // Check if location already exists
    const existingLocation = await prisma.locations.findFirst({
      where: {
        detail: {
          equals: trimmedDetail,
          mode: 'insensitive'
        },
        province
      }
    })

    if (existingLocation) {
      return res.status(409).json({
        success: false,
        error: 'Location already exists in this province'
      })
    }

    // Create new location
    const newLocation = await prisma.locations.create({
      data: {
        detail: trimmedDetail,
        province
      }
    })

    return res.status(201).json({
      success: true,
      data: newLocation,
      message: 'Location created successfully'
    })
  } catch (error) {
    console.error('Create location error:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to create location' 
    })
  }
}