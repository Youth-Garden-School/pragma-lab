import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponseBuilder } from '@/shared/utils/ApiResponseBuilder'
import prisma from '@/configs/prisma/prisma'
import { TripStatus } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await getTrips(req, res)
      case 'POST':
        return await createTrip(req, res)
      default:
        return res
          .status(405)
          .json(
            new ApiResponseBuilder()
              .setStatusCode(405)
              .setCode('METHOD_NOT_ALLOWED')
              .setMessage('Method not allowed')
              .build(),
          )
    }
  } catch (error) {
    console.error('Trip API Error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Internal server error')
          .build(),
      )
  }
}

async function getTrips(req: NextApiRequest, res: NextApiResponse) {
  const { page = '1', limit = '10', status, vehicleId } = req.query

  try {
    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const where: any = {}
    if (status) where.status = status
    if (vehicleId) where.vehicleId = parseInt(vehicleId as string)

    const [trips, total] = await Promise.all([
      prisma.trips.findMany({
        where,
        include: {
          vehicle: {
            include: {
              vehicleType: true,
            },
          },
          driver: {
            select: {
              userId: true,
              name: true,
              phone: true,
            },
          },
          tripStops: {
            include: {
              location: true,
            },
            orderBy: {
              stopOrder: 'asc',
            },
          },
          _count: {
            select: {
              tickets: true,
              tripSeats: {
                where: {
                  isBooked: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limitNum,
      }),
      prisma.trips.count({ where }),
    ])

    const totalPages = Math.ceil(total / limitNum)

    return res.status(200).json(
      new ApiResponseBuilder()
        .setStatusCode(200)
        .setCode('SUCCESS')
        .setMessage('Trips retrieved successfully')
        .setData({
          items: trips,
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
        })
        .build(),
    )
  } catch (error) {
    console.error('Get trips error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to retrieve trips')
          .build(),
      )
  }
}

async function createTrip(req: NextApiRequest, res: NextApiResponse) {
  const { vehicleId, driverId, note, tripStops } = req.body

  try {
    // Validate required fields
    if (!vehicleId || !driverId || !tripStops || !Array.isArray(tripStops)) {
      return res
        .status(400)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(400)
            .setCode('BAD_REQUEST')
            .setMessage('Missing required fields: vehicleId, driverId, tripStops')
            .build(),
        )
    }

    // Create trip with trip stops
    const trip = await prisma.trips.create({
      data: {
        vehicleId: parseInt(vehicleId),
        driverId: parseInt(driverId),
        note,
        status: TripStatus.upcoming,
        tripStops: {
          create: tripStops.map((stop: any, index: number) => ({
            locationId: parseInt(stop.locationId),
            stopOrder: index + 1,
            arrivalTime: new Date(stop.arrivalTime),
            departureTime: new Date(stop.departureTime),
            isPickup: stop.isPickup,
          })),
        },
      },
      include: {
        vehicle: {
          include: {
            vehicleType: true,
          },
        },
        driver: {
          select: {
            userId: true,
            name: true,
            phone: true,
          },
        },
        tripStops: {
          include: {
            location: true,
          },
          orderBy: {
            stopOrder: 'asc',
          },
        },
      },
    })

    return res
      .status(201)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(201)
          .setCode('SUCCESS')
          .setMessage('Trip created successfully')
          .setData(trip)
          .build(),
      )
  } catch (error) {
    console.error('Create trip error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to create trip')
          .build(),
      )
  }
}
