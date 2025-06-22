import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponseBuilder } from '@/shared/utils/ApiResponseBuilder'
import prisma from '@/configs/prisma/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await getTripSeats(req, res)
      case 'POST':
        return await createTripSeats(req, res)
      case 'PUT':
        return await updateTripSeat(req, res)
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
    console.error('Trip Seats API Error:', error)
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

async function getTripSeats(req: NextApiRequest, res: NextApiResponse) {
  const { tripId, seatNumber, isBooked } = req.query

  try {
    const where: any = {}
    if (tripId) where.tripId = parseInt(tripId as string)
    if (seatNumber) where.seatNumber = seatNumber.toString()
    if (isBooked !== undefined) where.isBooked = isBooked === 'true'

    const tripSeats = await prisma.tripSeats.findMany({
      where,
      include: {
        trip: {
          include: {
            vehicle: {
              include: {
                vehicleType: true,
              },
            },
          },
        },
        ticket: {
          include: {
            user: {
              select: {
                userId: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: [{ tripId: 'asc' }, { seatNumber: 'asc' }],
    })

    return res
      .status(200)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(200)
          .setCode('SUCCESS')
          .setMessage('Trip seats retrieved successfully')
          .setData(tripSeats)
          .build(),
      )
  } catch (error) {
    console.error('Get trip seats error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to retrieve trip seats')
          .build(),
      )
  }
}

async function createTripSeats(req: NextApiRequest, res: NextApiResponse) {
  const { tripId, seatConfigurations } = req.body

  try {
    // Validate required fields
    if (!tripId || !seatConfigurations || !Array.isArray(seatConfigurations)) {
      return res
        .status(400)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(400)
            .setCode('BAD_REQUEST')
            .setMessage('Missing required fields: tripId, seatConfigurations')
            .build(),
        )
    }

    // Get trip and vehicle info to validate
    const trip = await prisma.trips.findUnique({
      where: { tripId: parseInt(tripId) },
      include: {
        vehicle: {
          include: {
            vehicleType: {
              include: {
                seatConfigs: true,
              },
            },
          },
        },
      },
    })

    if (!trip) {
      return res
        .status(404)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(404)
            .setCode('NOT_FOUND')
            .setMessage('Trip not found')
            .build(),
        )
    }

    // Check if trip seats already exist
    const existingTripSeats = await prisma.tripSeats.findMany({
      where: { tripId: parseInt(tripId) },
    })

    if (existingTripSeats.length > 0) {
      return res
        .status(409)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(409)
            .setCode('CONFLICT')
            .setMessage('Trip seats already exist for this trip')
            .build(),
        )
    }

    // Create trip seats from seat configurations
    const tripSeatsData = seatConfigurations.map((seatConfig: any) => ({
      tripId: parseInt(tripId),
      seatNumber: seatConfig.seatNumber,
      isBooked: false,
      ticketId: null,
    }))

    const createdTripSeats = await prisma.tripSeats.createMany({
      data: tripSeatsData,
    })

    // Fetch created trip seats with relations
    const tripSeats = await prisma.tripSeats.findMany({
      where: { tripId: parseInt(tripId) },
      include: {
        trip: {
          include: {
            vehicle: {
              include: {
                vehicleType: true,
              },
            },
          },
        },
      },
      orderBy: { seatNumber: 'asc' },
    })

    return res.status(201).json(
      new ApiResponseBuilder()
        .setStatusCode(201)
        .setCode('SUCCESS')
        .setMessage('Trip seats created successfully')
        .setData({
          created: createdTripSeats.count,
          tripSeats,
        })
        .build(),
    )
  } catch (error) {
    console.error('Create trip seats error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to create trip seats')
          .build(),
      )
  }
}

async function updateTripSeat(req: NextApiRequest, res: NextApiResponse) {
  const { tripId, seatNumber, isBooked, ticketId } = req.body

  try {
    // Validate required fields
    if (!tripId || !seatNumber) {
      return res
        .status(400)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(400)
            .setCode('BAD_REQUEST')
            .setMessage('Missing required fields: tripId, seatNumber')
            .build(),
        )
    }

    // Check if trip seat exists
    const existingTripSeat = await prisma.tripSeats.findUnique({
      where: {
        tripId_seatNumber: {
          tripId: parseInt(tripId),
          seatNumber: seatNumber.toString(),
        },
      },
    })

    if (!existingTripSeat) {
      return res
        .status(404)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(404)
            .setCode('NOT_FOUND')
            .setMessage('Trip seat not found')
            .build(),
        )
    }

    // Update trip seat
    const updatedTripSeat = await prisma.tripSeats.update({
      where: {
        tripId_seatNumber: {
          tripId: parseInt(tripId),
          seatNumber: seatNumber.toString(),
        },
      },
      data: {
        isBooked: isBooked !== undefined ? Boolean(isBooked) : existingTripSeat.isBooked,
        ticketId:
          ticketId !== undefined
            ? ticketId
              ? parseInt(ticketId)
              : null
            : existingTripSeat.ticketId,
      },
      include: {
        trip: {
          include: {
            vehicle: {
              include: {
                vehicleType: true,
              },
            },
          },
        },
        ticket: {
          include: {
            user: {
              select: {
                userId: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    })

    return res
      .status(200)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(200)
          .setCode('SUCCESS')
          .setMessage('Trip seat updated successfully')
          .setData(updatedTripSeat)
          .build(),
      )
  } catch (error) {
    console.error('Update trip seat error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to update trip seat')
          .build(),
      )
  }
}
