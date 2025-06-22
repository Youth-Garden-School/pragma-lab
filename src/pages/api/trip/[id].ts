import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponseBuilder } from '@/shared/utils/ApiResponseBuilder'
import prisma from '@/configs/prisma/prisma'
import { TripStatus } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const tripId = parseInt(id as string)

  if (isNaN(tripId)) {
    return res
      .status(400)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(400)
          .setCode('BAD_REQUEST')
          .setMessage('Invalid trip ID')
          .build(),
      )
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getTripById(tripId, res)
      case 'PUT':
        return await updateTrip(tripId, req, res)
      case 'DELETE':
        return await deleteTrip(tripId, res)
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

async function getTripById(tripId: number, res: NextApiResponse) {
  try {
    const trip = await prisma.trips.findUnique({
      where: { tripId },
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
        tickets: {
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
        tripSeats: {
          include: {
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

    return res
      .status(200)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(200)
          .setCode('SUCCESS')
          .setMessage('Trip retrieved successfully')
          .setData(trip)
          .build(),
      )
  } catch (error) {
    console.error('Get trip by ID error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to retrieve trip')
          .build(),
      )
  }
}

async function updateTrip(tripId: number, req: NextApiRequest, res: NextApiResponse) {
  const { vehicleId, driverId, status, note, tripStops } = req.body

  try {
    // Check if trip exists
    const existingTrip = await prisma.trips.findUnique({
      where: { tripId },
    })

    if (!existingTrip) {
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

    // Prepare update data
    const updateData: any = {}
    if (vehicleId !== undefined) updateData.vehicleId = parseInt(vehicleId)
    if (driverId !== undefined) updateData.driverId = parseInt(driverId)
    if (status !== undefined) updateData.status = status
    if (note !== undefined) updateData.note = note

    // Update trip
    const updatedTrip = await prisma.trips.update({
      where: { tripId },
      data: updateData,
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

    // Update trip stops if provided
    if (tripStops && Array.isArray(tripStops)) {
      // Delete existing trip stops
      await prisma.tripStops.deleteMany({
        where: { tripId },
      })

      // Create new trip stops
      await prisma.tripStops.createMany({
        data: tripStops.map((stop: any, index: number) => ({
          tripId,
          locationId: parseInt(stop.locationId),
          stopOrder: index + 1,
          arrivalTime: new Date(stop.arrivalTime),
          departureTime: new Date(stop.departureTime),
          isPickup: stop.isPickup,
        })),
      })

      // Fetch updated trip with new stops
      const tripWithStops = await prisma.trips.findUnique({
        where: { tripId },
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
        .status(200)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(200)
            .setCode('SUCCESS')
            .setMessage('Trip updated successfully')
            .setData(tripWithStops)
            .build(),
        )
    }

    return res
      .status(200)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(200)
          .setCode('SUCCESS')
          .setMessage('Trip updated successfully')
          .setData(updatedTrip)
          .build(),
      )
  } catch (error) {
    console.error('Update trip error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to update trip')
          .build(),
      )
  }
}

async function deleteTrip(tripId: number, res: NextApiResponse) {
  try {
    // Check if trip exists
    const existingTrip = await prisma.trips.findUnique({
      where: { tripId },
      include: {
        tickets: true,
        tripSeats: true,
      },
    })

    if (!existingTrip) {
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

    // Check if trip has active bookings
    const hasActiveBookings = existingTrip.tickets.some(
      (ticket) => ticket.status === 'booked' || ticket.status === 'completed',
    )

    if (hasActiveBookings) {
      return res
        .status(409)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(409)
            .setCode('CONFLICT')
            .setMessage('Cannot delete trip with active bookings')
            .build(),
        )
    }

    // Delete trip stops first
    await prisma.tripStops.deleteMany({
      where: { tripId },
    })

    // Delete trip seats
    await prisma.tripSeats.deleteMany({
      where: { tripId },
    })

    // Delete tickets
    await prisma.tickets.deleteMany({
      where: { tripId },
    })

    // Delete trip
    await prisma.trips.delete({
      where: { tripId },
    })

    return res
      .status(200)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(200)
          .setCode('SUCCESS')
          .setMessage('Trip deleted successfully')
          .build(),
      )
  } catch (error) {
    console.error('Delete trip error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to delete trip')
          .build(),
      )
  }
}
