import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponseBuilder } from '@/shared/utils/ApiResponseBuilder'
import prisma from '@/configs/prisma/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await getSeatConfigurations(req, res)
      case 'POST':
        return await createSeatConfiguration(req, res)
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
    console.error('Seat Configuration API Error:', error)
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

async function getSeatConfigurations(req: NextApiRequest, res: NextApiResponse) {
  const { vehicleTypeId, page = '1', limit = '50' } = req.query

  try {
    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const where: any = {}
    if (vehicleTypeId) where.vehicleTypeId = parseInt(vehicleTypeId as string)

    console.log('Querying seat configurations with params:', { pageNum, limitNum, skip, where })

    // Test database connection first
    const totalCount = await prisma.seatConfigurations.count()
    console.log('Total seat configurations in database:', totalCount)

    const [seatConfigs, total] = await Promise.all([
      prisma.seatConfigurations.findMany({
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
        skip,
        take: limitNum,
      }),
      prisma.seatConfigurations.count({ where }),
    ])

    console.log(`Found ${seatConfigs.length} seat configs out of ${total} total`)

    const totalPages = Math.ceil(total / limitNum)

    return res.status(200).json(
      new ApiResponseBuilder()
        .setStatusCode(200)
        .setCode('SUCCESS')
        .setMessage('Seat configurations retrieved successfully')
        .setData({
          items: seatConfigs,
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
        })
        .build(),
    )
  } catch (error) {
    console.error('Get seat configurations error:', error)
    return res.status(500).json(
      new ApiResponseBuilder()
        .setStatusCode(500)
        .setCode('INTERNAL_SERVER_ERROR')
        .setMessage('Failed to retrieve seat configurations')
        .setData({ error: error instanceof Error ? error.message : 'Unknown error' })
        .build(),
    )
  }
}

async function createSeatConfiguration(req: NextApiRequest, res: NextApiResponse) {
  const { vehicleTypeId, seatNumber, rowNumber, columnNumber, isAvailable = true } = req.body

  try {
    // Validate required fields
    if (!vehicleTypeId || !seatNumber || rowNumber === undefined || columnNumber === undefined) {
      return res
        .status(400)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(400)
            .setCode('BAD_REQUEST')
            .setMessage(
              'Missing required fields: vehicleTypeId, seatNumber, rowNumber, columnNumber',
            )
            .build(),
        )
    }

    // Check if seat configuration already exists for this vehicle type and seat number
    const existingSeat = await prisma.seatConfigurations.findFirst({
      where: {
        vehicleTypeId: parseInt(vehicleTypeId),
        seatNumber: seatNumber.toString(),
      },
    })

    if (existingSeat) {
      return res
        .status(409)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(409)
            .setCode('CONFLICT')
            .setMessage('Seat configuration already exists for this vehicle type and seat number')
            .build(),
        )
    }

    // Create seat configuration
    const seatConfig = await prisma.seatConfigurations.create({
      data: {
        vehicleTypeId: parseInt(vehicleTypeId),
        seatNumber: seatNumber.toString(),
        rowNumber: parseInt(rowNumber),
        columnNumber: parseInt(columnNumber),
        isAvailable: Boolean(isAvailable),
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

    return res
      .status(201)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(201)
          .setCode('SUCCESS')
          .setMessage('Seat configuration created successfully')
          .setData(seatConfig)
          .build(),
      )
  } catch (error) {
    console.error('Create seat configuration error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to create seat configuration')
          .build(),
      )
  }
}
