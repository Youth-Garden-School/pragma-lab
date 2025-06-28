import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface SearchTripStopsQuery {
  search?: string
  province?: string
  limit?: string
  pickupLocationId?: string
  dropoffLocationId?: string
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const {
      search,
      province,
      limit = '100',
      pickupLocationId,
      dropoffLocationId,
    } = req.query as SearchTripStopsQuery

    // Build where clause for locations
    const whereLocation: any = {}

    // Chỉ thêm điều kiện search nếu có search query
    if (search && search.length > 0) {
      whereLocation.OR = [
        {
          detail: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          province: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ]
    }

    if (province && province !== 'All Provinces') {
      whereLocation.province = province
    }

    const limitNum = Math.min(parseInt(limit), 100)

    // Nếu có pickupLocationId và dropoffLocationId, tìm chuyến xe có route này
    if (pickupLocationId && dropoffLocationId) {
      const tripsWithRoute = await prisma.trips.findMany({
        where: {
          status: {
            in: ['upcoming', 'ongoing'],
          },
          tripStops: {
            some: {
              locationId: parseInt(pickupLocationId),
              isPickup: true,
            },
          },
        },
        include: {
          tripStops: {
            where: {
              locationId: parseInt(dropoffLocationId),
              isPickup: false,
            },
            include: {
              location: true,
            },
          },
        },
      })

      // Chỉ trả về locations có trong route hợp lệ
      const validLocationIds = new Set<number>()

      tripsWithRoute.forEach((trip) => {
        trip.tripStops.forEach((stop) => {
          validLocationIds.add(stop.location.locationId)
        })
      })

      // Lấy tất cả locations có trong route hợp lệ
      const locations = await prisma.locations.findMany({
        where: {
          locationId: {
            in: Array.from(validLocationIds),
          },
          ...whereLocation,
        },
        include: {
          tripStops: {
            include: {
              trip: true,
            },
          },
        },
        take: limitNum,
        orderBy: [{ province: 'asc' }, { detail: 'asc' }],
      })

      const transformedData = locations.map((location) => ({
        locationId: location.locationId,
        detail: location.detail,
        province: location.province,
        tripCount: location.tripStops.reduce(
          (count: number, tripStop) =>
            count +
            (tripStop.trip.status === 'upcoming' || tripStop.trip.status === 'ongoing' ? 1 : 0),
          0,
        ),
      }))

      return res.status(200).json({
        success: true,
        data: transformedData,
      })
    }

    // Nếu không có route cụ thể, lấy tất cả locations có active trips
    const locations = await prisma.locations.findMany({
      where: whereLocation,
      include: {
        tripStops: {
          include: {
            trip: true,
          },
        },
      },
      take: limitNum,
      orderBy: [{ province: 'asc' }, { detail: 'asc' }],
    })

    // Filter locations that have active trips
    const activeLocations = locations.filter((location) =>
      location.tripStops.some(
        (tripStop) => tripStop.trip.status === 'upcoming' || tripStop.trip.status === 'ongoing',
      ),
    )

    // Transform data to match the expected format
    const transformedData = activeLocations.map((location) => ({
      locationId: location.locationId,
      detail: location.detail,
      province: location.province,
      tripCount: location.tripStops.reduce(
        (count: number, tripStop) =>
          count +
          (tripStop.trip.status === 'upcoming' || tripStop.trip.status === 'ongoing' ? 1 : 0),
        0,
      ),
    }))

    return res.status(200).json({
      success: true,
      data: transformedData,
    })
  } catch (error) {
    console.error('Search trip stops error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to search trip stops',
    })
  } finally {
    await prisma.$disconnect()
  }
}
