// pages/api/vehicle-types/[id].ts
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    const vehicleTypeId = parseInt(id as string)

    if (isNaN(vehicleTypeId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid vehicle type ID'
      })
    }

    switch (req.method) {
      case 'GET':
        return await getVehicleType(vehicleTypeId, res)
      case 'PUT':
        return await updateVehicleType(vehicleTypeId, req, res)
      case 'DELETE':
        return await deleteVehicleType(vehicleTypeId, res)
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
}

async function getVehicleType(vehicleTypeId: number, res: NextApiResponse) {
  try {
    const vehicleType = await prisma.vehicleTypes.findUnique({
      where: { vehicleTypeId },
      include: {
        vehicles: {
          select: {
            vehicleId: true,
            licensePlate: true
          }
        },
        seatConfigs: {
          orderBy: [
            { rowNumber: 'asc' },
            { columnNumber: 'asc' }
          ]
        },
        _count: {
          select: {
            vehicles: true
          }
        }
      }
    })

    if (!vehicleType) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle type not found'
      })
    }

    return res.status(200).json({
      success: true,
      data: vehicleType
    })
  } catch (error) {
    console.error('Get vehicle type error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch vehicle type'
    })
  }
}

async function updateVehicleType(vehicleTypeId: number, req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, seatCapacity, pricePerSeat } = req.body

    // Check if vehicle type exists
    const existingType = await prisma.vehicleTypes.findUnique({
      where: { vehicleTypeId }
    })

    if (!existingType) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle type not found'
      })
    }

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

    // Check if name already exists (excluding current record)
    const duplicateName = await prisma.vehicleTypes.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        },
        vehicleTypeId: {
          not: vehicleTypeId
        }
      }
    })

    if (duplicateName) {
      return res.status(409).json({
        success: false,
        error: 'Vehicle type with this name already exists'
      })
    }

    const updatedVehicleType = await prisma.vehicleTypes.update({
      where: { vehicleTypeId },
      data: {
        name: name.trim(),
        seatCapacity: parseInt(seatCapacity),
        pricePerSeat: parseFloat(pricePerSeat)
      }
    })

    return res.status(200).json({
      success: true,
      data: updatedVehicleType,
      message: 'Vehicle type updated successfully'
    })
  } catch (error) {
    console.error('Update vehicle type error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to update vehicle type'
    })
  }
}

async function deleteVehicleType(vehicleTypeId: number, res: NextApiResponse) {
  try {
    // Check if vehicle type exists
    const existingType = await prisma.vehicleTypes.findUnique({
      where: { vehicleTypeId },
      include: {
        vehicles: true,
        seatConfigs: true
      }
    })

    if (!existingType) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle type not found'
      })
    }

    // Check if there are vehicles using this type
    if (existingType.vehicles.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete vehicle type that has vehicles assigned to it'
      })
    }

    // Delete seat configurations first (if any)
    if (existingType.seatConfigs.length > 0) {
      await prisma.seatConfigurations.deleteMany({
        where: { vehicleTypeId }
      })
    }

    // Delete the vehicle type
    await prisma.vehicleTypes.delete({
      where: { vehicleTypeId }
    })

    return res.status(200).json({
      success: true,
      message: 'Vehicle type deleted successfully'
    })
  } catch (error) {
    console.error('Delete vehicle type error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to delete vehicle type'
    })
  }
}