// pages/api/vehicles/[id].ts
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    const vehicleId = parseInt(id as string)

    if (isNaN(vehicleId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid vehicle ID'
      })
    }

    switch (req.method) {
      case 'GET':
        return await getVehicle(vehicleId, res)
      case 'PUT':
        return await updateVehicle(vehicleId, req, res)
      case 'DELETE':
        return await deleteVehicle(vehicleId, res)
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

async function getVehicle(vehicleId: number, res: NextApiResponse) {
  try {
    const vehicle = await prisma.vehicles.findUnique({
      where: { vehicleId },
      include: {
        vehicleType: {
          select: {
            vehicleTypeId: true,
            name: true,
            seatCapacity: true,
            pricePerSeat: true
          }
        },
        trips: {
          include: {
            driver: {
              select: {
                userId: true,
                name: true,
                phone: true
              }
            },
            tripStops: {
              include: {
                location: {
                  select: {
                    locationId: true,
                    detail: true,
                    province: true
                  }
                }
              },
              orderBy: {
                stopOrder: 'asc'
              }
            },
            _count: {
              select: {
                tickets: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      })
    }

    return res.status(200).json({
      success: true,
      data: vehicle
    })
  } catch (error) {
    console.error('Get vehicle error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch vehicle'
    })
  }
}

async function updateVehicle(vehicleId: number, req: NextApiRequest, res: NextApiResponse) {
  try {
    const { licensePlate, vehicleTypeId } = req.body

    // Check if vehicle exists
    const existingVehicle = await prisma.vehicles.findUnique({
      where: { vehicleId }
    })

    if (!existingVehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      })
    }

    // Validation
    if (!licensePlate || !vehicleTypeId) {
      return res.status(400).json({
        success: false,
        error: 'License plate and vehicle type are required'
      })
    }

    // Validate license plate format (Vietnam format: 12A-34567)
    const vietnamLicensePlateRegex = /^[0-9]{2}[A-Z]-[0-9]{4,5}$/
    if (!vietnamLicensePlateRegex.test(licensePlate.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid license plate format. Use format: 12A-34567'
      })
    }

    // Check if license plate already exists (excluding current vehicle)
    const duplicateLicensePlate = await prisma.vehicles.findFirst({
      where: {
        licensePlate: {
          equals: licensePlate.trim(),
          mode: 'insensitive'
        },
        vehicleId: {
          not: vehicleId
        }
      }
    })

    if (duplicateLicensePlate) {
      return res.status(409).json({
        success: false,
        error: 'Vehicle with this license plate already exists'
      })
    }

    // Check if vehicle type exists
    const vehicleType = await prisma.vehicleTypes.findUnique({
      where: { vehicleTypeId: parseInt(vehicleTypeId) }
    })

    if (!vehicleType) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle type not found'
      })
    }

    const updatedVehicle = await prisma.vehicles.update({
      where: { vehicleId },
      data: {
        licensePlate: licensePlate.trim().toUpperCase(),
        vehicleTypeId: parseInt(vehicleTypeId)
      },
      include: {
        vehicleType: {
          select: {
            vehicleTypeId: true,
            name: true,
            seatCapacity: true,
            pricePerSeat: true
          }
        }
      }
    })

    return res.status(200).json({
      success: true,
      data: updatedVehicle,
      message: 'Vehicle updated successfully'
    })
  } catch (error) {
    console.error('Update vehicle error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to update vehicle'
    })
  }
}

async function deleteVehicle(vehicleId: number, res: NextApiResponse) {
  try {
    // Check if vehicle exists
    const existingVehicle = await prisma.vehicles.findUnique({
      where: { vehicleId },
      include: {
        trips: {
          where: {
            status: {
              in: ['upcoming', 'ongoing']
            }
          }
        }
      }
    })

    if (!existingVehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      })
    }

    // Check if vehicle has active trips
    if (existingVehicle.trips.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete vehicle that has upcoming or ongoing trips'
      })
    }

    // Delete the vehicle
    await prisma.vehicles.delete({
      where: { vehicleId }
    })

    return res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully'
    })
  } catch (error) {
    console.error('Delete vehicle error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to delete vehicle'
    })
  }
}