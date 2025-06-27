// pages/api/vehicle-types/index.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { ApiResponseBuilder } from '@/shared/utils/ApiResponseBuilder'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await getVehicleTypes(req, res)
      case 'POST':
        return await createVehicleType(req, res)
      default:
        res.setHeader('Allow', ['GET', 'POST'])
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
    console.error('API Error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Internal server error')
          .build(),
      )
  } finally {
    await prisma.$disconnect()
  }
}

async function getVehicleTypes(req: NextApiRequest, res: NextApiResponse) {
  try {
    const vehicleTypes = await prisma.vehicleTypes.findMany({
      include: {
        vehicles: {
          select: {
            vehicleId: true,
            licensePlate: true,
          },
        },
        seatConfigs: true,
        _count: {
          select: {
            vehicles: true,
          },
        },
      },
      orderBy: {
        vehicleTypeId: 'asc',
      },
    })

    return res
      .status(200)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(200)
          .setCode('SUCCESS')
          .setMessage('Vehicle types retrieved successfully')
          .setData(vehicleTypes)
          .build(),
      )
  } catch (error) {
    console.error('Get vehicle types error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to fetch vehicle types')
          .build(),
      )
  }
}

async function createVehicleType(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, seatCapacity, pricePerSeat } = req.body

    // Validation
    if (!name || !seatCapacity || !pricePerSeat) {
      return res
        .status(400)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(400)
            .setCode('BAD_REQUEST')
            .setMessage('Name, seat capacity, and price per seat are required')
            .build(),
        )
    }

    if (seatCapacity <= 0 || pricePerSeat <= 0) {
      return res
        .status(400)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(400)
            .setCode('BAD_REQUEST')
            .setMessage('Seat capacity and price must be positive numbers')
            .build(),
        )
    }

    // Check if vehicle type name already exists
    const existingType = await prisma.vehicleTypes.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    })

    if (existingType) {
      return res
        .status(409)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(409)
            .setCode('CONFLICT')
            .setMessage('Vehicle type with this name already exists')
            .build(),
        )
    }

    const newVehicleType = await prisma.vehicleTypes.create({
      data: {
        name: name.trim(),
        seatCapacity: parseInt(seatCapacity),
        pricePerSeat: parseFloat(pricePerSeat),
      },
    })

    return res
      .status(201)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(201)
          .setCode('SUCCESS')
          .setMessage('Vehicle type created successfully')
          .setData(newVehicleType)
          .build(),
      )
  } catch (error) {
    console.error('Create vehicle type error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to create vehicle type')
          .build(),
      )
  }
}
