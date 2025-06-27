// pages/api/locations/statistics.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, TripStatus } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET'])
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    return await getLocationStatistics(req, res)
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
}

async function getLocationStatistics(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const totalLocations = await prisma.locations.count()

    const locationsByProvince = await prisma.locations.groupBy({
      by: ['province'],
      _count: {
        locationId: true,
      },
      orderBy: {
        _count: {
          locationId: 'desc',
        },
      },
    })

    const locationsWithTrips = await prisma.locations.findMany({
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

    const usageStats = locationsWithTrips.reduce(
      (stats, location) => {
        const totalTrips = location.tripStops.length
        const activeTrips = location.tripStops.filter(
          (stop) =>
            stop.trip.status === 'upcoming' || stop.trip.status === 'ongoing'
        ).length

        if (totalTrips > 0) {
          stats.usedLocations++
          stats.totalTrips += totalTrips
          stats.activeTrips += activeTrips
        } else {
          stats.unusedLocations++
        }

        return stats
      },
      {
        usedLocations: 0,
        unusedLocations: 0,
        totalTrips: 0,
        activeTrips: 0,
      }
    )

    const popularLocations = locationsWithTrips
      .map((location) => ({
        locationId: location.locationId,
        detail: location.detail,
        province: location.province,
        tripsCount: location.tripStops.length,
        activeTripsCount: location.tripStops.filter(
          (stop) =>
            stop.trip.status === 'upcoming' || stop.trip.status === 'ongoing'
        ).length,
      }))
      .sort((a, b) => b.tripsCount - a.tripsCount)
      .slice(0, 10)

    const recentLocations = await prisma.locations.findMany({
      orderBy: {
        locationId: 'desc',
      },
      take: 5,
      select: {
        locationId: true,
        detail: true,
        province: true,
      },
    })

    const statistics = {
      overview: {
        totalLocations,
        usedLocations: usageStats.usedLocations,
        unusedLocations: usageStats.unusedLocations,
        totalTrips: usageStats.totalTrips,
        activeTrips: usageStats.activeTrips,
        usageRate:
          totalLocations > 0
            ? Math.round((usageStats.usedLocations / totalLocations) * 100)
            : 0,
      },
      byProvince: locationsByProvince.map((item) => ({
        province: item.province,
        count: item._count.locationId,
        percentage:
          totalLocations > 0
            ? Math.round((item._count.locationId / totalLocations) * 100)
            : 0,
      })),
      popularLocations,
      recentLocations,
      trends: {
        averageTripsPerLocation:
          totalLocations > 0
            ? Math.round((usageStats.totalTrips / totalLocations) * 100) / 100
            : 0,
        averageActiveTripsPerLocation:
          totalLocations > 0
            ? Math.round((usageStats.activeTrips / totalLocations) * 100) / 100
            : 0,
      },
    }

    res.status(200).json({
      success: true,
      data: statistics,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Get location statistics error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch location statistics',
    })
  }
}
