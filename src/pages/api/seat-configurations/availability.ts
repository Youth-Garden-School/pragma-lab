import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponseBuilder } from '@/shared/utils/ApiResponseBuilder'
import prisma from '@/configs/prisma/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await getSeatAvailability(req, res)
      case 'PUT':
        return await updateSeatAvailability(req, res)
      case 'POST':
        return await bulkUpdateSeatAvailability(req, res)
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
    console.error('Seat Availability API Error:', error)
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

async function getSeatAvailability(req: NextApiRequest, res: NextApiResponse) {
  const { vehicleTypeId, tripId, isAvailable } = req.query

  try {
    let seatData: any[] = []

    if (tripId) {
      // Get seat availability for a specific trip
      const tripSeats = await prisma.tripSeats.findMany({
        where: {
          tripId: parseInt(tripId as string),
          ...(isAvailable !== undefined && { isBooked: isAvailable === 'false' }),
        },
        include: {
          trip: {
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
        orderBy: { seatNumber: 'asc' },
      })

      // Merge with seat configurations to get complete seat info
      const seatConfigs = await prisma.seatConfigurations.findMany({
        where: {
          vehicleTypeId: tripSeats[0]?.trip?.vehicle?.vehicleTypeId,
        },
      })

      seatData = tripSeats.map((tripSeat) => {
        const seatConfig = seatConfigs.find((config) => config.seatNumber === tripSeat.seatNumber)
        return {
          ...tripSeat,
          seatConfig,
        }
      })
    } else if (vehicleTypeId) {
      // Get seat configurations for a vehicle type
      seatData = await prisma.seatConfigurations.findMany({
        where: {
          vehicleTypeId: parseInt(vehicleTypeId as string),
          ...(isAvailable !== undefined && { isAvailable: isAvailable === 'true' }),
        },
        include: {
          vehicleType: {
            select: {
              vehicleTypeId: true,
              name: true,
              seatCapacity: true,
              pricePerSeat: true,
            },
          },
        },
        orderBy: [{ rowNumber: 'asc' }, { columnNumber: 'asc' }],
      })
    } else {
      return res
        .status(400)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(400)
            .setCode('BAD_REQUEST')
            .setMessage('Either vehicleTypeId or tripId is required')
            .build(),
        )
    }

    // Calculate statistics with proper type checking
    const totalSeats = seatData.length
    let availableSeats = 0

    if (tripId) {
      // For trip seats, count seats that are not booked
      availableSeats = seatData.filter((seat) => !seat.isBooked).length
    } else {
      // For seat configurations, count seats that are available
      availableSeats = seatData.filter((seat) => seat.isAvailable).length
    }

    const unavailableSeats = totalSeats - availableSeats

    return res.status(200).json(
      new ApiResponseBuilder()
        .setStatusCode(200)
        .setCode('SUCCESS')
        .setMessage('Seat availability retrieved successfully')
        .setData({
          seats: seatData,
          statistics: {
            total: totalSeats,
            available: availableSeats,
            unavailable: unavailableSeats,
            availabilityRate:
              totalSeats > 0 ? ((availableSeats / totalSeats) * 100).toFixed(2) : '0',
          },
        })
        .build(),
    )
  } catch (error) {
    console.error('Get seat availability error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to retrieve seat availability')
          .build(),
      )
  }
}

async function updateSeatAvailability(req: NextApiRequest, res: NextApiResponse) {
  const { seatConfigId, isAvailable } = req.body

  try {
    // Validate required fields
    if (!seatConfigId || isAvailable === undefined) {
      return res
        .status(400)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(400)
            .setCode('BAD_REQUEST')
            .setMessage('Missing required fields: seatConfigId, isAvailable')
            .build(),
        )
    }

    // Check if seat configuration exists
    const existingSeatConfig = await prisma.seatConfigurations.findUnique({
      where: { seatConfigId: parseInt(seatConfigId) },
    })

    if (!existingSeatConfig) {
      return res
        .status(404)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(404)
            .setCode('NOT_FOUND')
            .setMessage('Seat configuration not found')
            .build(),
        )
    }

    // Check if seat is currently booked in any active trips
    if (!isAvailable) {
      const bookedSeats = await prisma.tripSeats.findMany({
        where: {
          seatNumber: existingSeatConfig.seatNumber,
          isBooked: true,
          trip: {
            status: {
              in: ['upcoming', 'ongoing'],
            },
          },
        },
      })

      if (bookedSeats.length > 0) {
        return res
          .status(409)
          .json(
            new ApiResponseBuilder()
              .setStatusCode(409)
              .setCode('CONFLICT')
              .setMessage('Cannot set seat as unavailable while it is booked in active trips')
              .build(),
          )
      }
    }

    // Update seat availability
    const updatedSeatConfig = await prisma.seatConfigurations.update({
      where: { seatConfigId: parseInt(seatConfigId) },
      data: { isAvailable: Boolean(isAvailable) },
      include: {
        vehicleType: {
          select: {
            vehicleTypeId: true,
            name: true,
            seatCapacity: true,
            pricePerSeat: true,
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
          .setMessage('Seat availability updated successfully')
          .setData(updatedSeatConfig)
          .build(),
      )
  } catch (error) {
    console.error('Update seat availability error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to update seat availability')
          .build(),
      )
  }
}

async function bulkUpdateSeatAvailability(req: NextApiRequest, res: NextApiResponse) {
  const { vehicleTypeId, isAvailable, seatNumbers } = req.body

  try {
    // Validate required fields
    if (!vehicleTypeId || isAvailable === undefined) {
      return res
        .status(400)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(400)
            .setCode('BAD_REQUEST')
            .setMessage('Missing required fields: vehicleTypeId, isAvailable')
            .build(),
        )
    }

    // Build where clause
    const where: any = {
      vehicleTypeId: parseInt(vehicleTypeId),
    }

    if (seatNumbers && Array.isArray(seatNumbers)) {
      where.seatNumber = { in: seatNumbers.map((num: any) => num.toString()) }
    }

    // Check if any seats are currently booked in active trips (when setting to unavailable)
    if (!isAvailable) {
      const seatConfigs = await prisma.seatConfigurations.findMany({ where })
      const seatNumbersToCheck = seatConfigs.map((config) => config.seatNumber)

      const bookedSeats = await prisma.tripSeats.findMany({
        where: {
          seatNumber: { in: seatNumbersToCheck },
          isBooked: true,
          trip: {
            status: {
              in: ['upcoming', 'ongoing'],
            },
          },
        },
      })

      if (bookedSeats.length > 0) {
        const bookedSeatNumbers = [...new Set(bookedSeats.map((seat) => seat.seatNumber))]
        return res.status(409).json(
          new ApiResponseBuilder()
            .setStatusCode(409)
            .setCode('CONFLICT')
            .setMessage(
              `Cannot set seats as unavailable while they are booked in active trips: ${bookedSeatNumbers.join(', ')}`,
            )
            .build(),
        )
      }
    }

    // Update seat availability
    const updateResult = await prisma.seatConfigurations.updateMany({
      where,
      data: { isAvailable: Boolean(isAvailable) },
    })

    // Fetch updated seat configurations
    const updatedSeatConfigs = await prisma.seatConfigurations.findMany({
      where,
      include: {
        vehicleType: {
          select: {
            vehicleTypeId: true,
            name: true,
            seatCapacity: true,
            pricePerSeat: true,
          },
        },
      },
      orderBy: [{ rowNumber: 'asc' }, { columnNumber: 'asc' }],
    })

    return res.status(200).json(
      new ApiResponseBuilder()
        .setStatusCode(200)
        .setCode('SUCCESS')
        .setMessage('Bulk seat availability update completed')
        .setData({
          updated: updateResult.count,
          seatConfigurations: updatedSeatConfigs,
        })
        .build(),
    )
  } catch (error) {
    console.error('Bulk update seat availability error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to update seat availability')
          .build(),
      )
  }
}
