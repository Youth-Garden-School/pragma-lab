// pages/api/vehicles/index.ts
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/configs/prisma/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await getVehicles(req, res)
      case 'POST':
        return await createVehicle(req, res)
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getVehicles(req: NextApiRequest, res: NextApiResponse) {
  try {
    const vehicles = await prisma.vehicles.findMany({
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
      orderBy: {
        vehicleId: 'asc',
      },
    })
    return res.status(200).json({ success: true, data: vehicles })
  } catch (error) {
    console.error('Get vehicles error:', error)
    return res.status(500).json({ success: false, error: 'Failed to fetch vehicles' })
  }
}

async function createVehicle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { licensePlate, vehicleTypeId } = req.body

    // Validation
    if (!licensePlate || !vehicleTypeId) {
      return res.status(400).json({
        success: false,
        error: 'License plate and vehicle type are required',
      })
    }

    // Validate license plate format (Vietnam format: 12A-34567)
    const vietnamLicensePlateRegex = /^[0-9]{2}[A-Z]-[0-9]{4,5}$/
    if (!vietnamLicensePlateRegex.test(licensePlate.trim().toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid license plate format. Use format: 12A-34567',
      })
    }

    // Check if license plate already exists
    const existingVehicle = await prisma.vehicles.findFirst({
      where: {
        licensePlate: {
          equals: licensePlate.trim().toUpperCase(),
          mode: 'insensitive',
        },
      },
    })
    if (existingVehicle) {
      return res.status(409).json({
        success: false,
        error: 'Vehicle with this license plate already exists',
      })
    }

    // Check if vehicle type exists
    const vehicleType = await prisma.vehicleTypes.findUnique({
      where: { vehicleTypeId: parseInt(vehicleTypeId) },
    })
    if (!vehicleType) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle type not found',
      })
    }

    const newVehicle = await prisma.vehicles.create({
      data: {
        licensePlate: licensePlate.trim().toUpperCase(),
        vehicleTypeId: parseInt(vehicleTypeId),
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
    })

    return res.status(201).json({
      success: true,
      data: newVehicle,
      message: 'Vehicle created successfully',
    })
  } catch (error) {
    console.error('Create vehicle error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to create vehicle',
    })
  }
}
