// pages/api/vehicle-types/index.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

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
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
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
            licensePlate: true
          }
        },
        seatConfigs: true,
        _count: {
          select: {
            vehicles: true
          }
        }
      },
      orderBy: {
        vehicleTypeId: 'asc'
      }
    })

    return res.status(200).json({
      success: true,
      data: vehicleTypes
    })
  } catch (error) {
    console.error('Get vehicle types error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch vehicle types'
    })
  }
}

async function createVehicleType(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, seatCapacity, pricePerSeat } = req.body

    // Validation
    if (!name || !seatCapacity || !pricePerSeat) {
      return res.status(400).json({
        success: false,
        error: 'Name, seat capacity, and price per seat are required'
      })
    }

    if (seatCapacity <= 0 || pricePerSeat <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Seat capacity and price must be positive numbers'
      })
    }

    // Check if vehicle type name already exists
    const existingType = await prisma.vehicleTypes.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    })

    if (existingType) {
      return res.status(409).json({
        success: false,
        error: 'Vehicle type with this name already exists'
      })
    }

    const newVehicleType = await prisma.vehicleTypes.create({
      data: {
        name: name.trim(),
        seatCapacity: parseInt(seatCapacity),
        pricePerSeat: parseFloat(pricePerSeat)
      }
    })

    return res.status(201).json({
      success: true,
      data: newVehicleType,
      message: 'Vehicle type created successfully'
    })
  } catch (error) {
    console.error('Create vehicle type error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to create vehicle type'
    })
  }
}