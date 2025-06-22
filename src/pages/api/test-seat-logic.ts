import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponseBuilder } from '@/shared/utils/ApiResponseBuilder'
import prisma from '@/configs/prisma/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
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

  try {
    // Test 1: Check if vehicle types exist
    const vehicleTypes = await prisma.vehicleTypes.findMany({
      include: {
        seatConfigs: true,
        vehicles: {
          include: {
            trips: {
              include: {
                tripSeats: true,
              },
            },
          },
        },
      },
    })

    // Test 2: Check seat configurations
    const seatConfigs = await prisma.seatConfigurations.findMany({
      include: {
        vehicleType: true,
      },
    })

    // Test 3: Check trip seats
    const tripSeats = await prisma.tripSeats.findMany({
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

    // Test 4: Validate relationships
    const validationResults = {
      vehicleTypesCount: vehicleTypes.length,
      seatConfigsCount: seatConfigs.length,
      tripSeatsCount: tripSeats.length,
      relationships: {
        vehicleTypesWithSeatConfigs: vehicleTypes.filter((vt) => vt.seatConfigs.length > 0).length,
        vehiclesWithTrips: vehicleTypes.reduce((acc, vt) => acc + vt.vehicles.length, 0),
        tripsWithSeats: tripSeats.reduce((acc, ts) => {
          if (!acc.includes(ts.tripId)) acc.push(ts.tripId)
          return acc
        }, [] as number[]).length,
      },
      sampleData: {
        firstVehicleType: vehicleTypes[0]
          ? {
              id: vehicleTypes[0].vehicleTypeId,
              name: vehicleTypes[0].name,
              seatCapacity: vehicleTypes[0].seatCapacity,
              seatConfigsCount: vehicleTypes[0].seatConfigs.length,
            }
          : null,
        firstSeatConfig: seatConfigs[0]
          ? {
              id: seatConfigs[0].seatConfigId,
              seatNumber: seatConfigs[0].seatNumber,
              vehicleTypeId: seatConfigs[0].vehicleTypeId,
              isAvailable: seatConfigs[0].isAvailable,
            }
          : null,
        firstTripSeat: tripSeats[0]
          ? {
              tripId: tripSeats[0].tripId,
              seatNumber: tripSeats[0].seatNumber,
              isBooked: tripSeats[0].isBooked,
              hasTicket: !!tripSeats[0].ticketId,
            }
          : null,
      },
    }

    return res
      .status(200)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(200)
          .setCode('SUCCESS')
          .setMessage('Seat logic test completed')
          .setData(validationResults)
          .build(),
      )
  } catch (error) {
    console.error('Test seat logic error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to test seat logic')
          .build(),
      )
  }
}
