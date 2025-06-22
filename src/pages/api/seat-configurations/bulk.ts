import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponseBuilder } from '@/shared/utils/ApiResponseBuilder'
import prisma from '@/configs/prisma/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST':
        return await bulkCreateSeatConfigurations(req, res)
      case 'PUT':
        return await bulkUpdateSeatConfigurations(req, res)
      case 'DELETE':
        return await bulkDeleteSeatConfigurations(req, res)
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
    console.error('Bulk Seat Configuration API Error:', error)
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

async function bulkCreateSeatConfigurations(req: NextApiRequest, res: NextApiResponse) {
  const { vehicleTypeId, seatConfigurations } = req.body

  try {
    // Validate required fields
    if (!vehicleTypeId || !seatConfigurations || !Array.isArray(seatConfigurations)) {
      return res
        .status(400)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(400)
            .setCode('BAD_REQUEST')
            .setMessage('Missing required fields: vehicleTypeId, seatConfigurations')
            .build(),
        )
    }

    // Validate vehicle type exists
    const vehicleType = await prisma.vehicleTypes.findUnique({
      where: { vehicleTypeId: parseInt(vehicleTypeId) },
    })

    if (!vehicleType) {
      return res
        .status(404)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(404)
            .setCode('NOT_FOUND')
            .setMessage('Vehicle type not found')
            .build(),
        )
    }

    // Validate seat configurations
    const validatedConfigs = seatConfigurations.map((config: any, index: number) => {
      if (
        !config.seatNumber ||
        config.rowNumber === undefined ||
        config.columnNumber === undefined
      ) {
        throw new Error(`Invalid seat configuration at index ${index}`)
      }
      return {
        vehicleTypeId: parseInt(vehicleTypeId),
        seatNumber: config.seatNumber.toString(),
        rowNumber: parseInt(config.rowNumber),
        columnNumber: parseInt(config.columnNumber),
        isAvailable: config.isAvailable !== undefined ? Boolean(config.isAvailable) : true,
      }
    })

    // Check for duplicate seat numbers
    const seatNumbers = validatedConfigs.map((config) => config.seatNumber)
    const duplicateSeatNumbers = seatNumbers.filter(
      (seatNumber, index) => seatNumbers.indexOf(seatNumber) !== index,
    )

    if (duplicateSeatNumbers.length > 0) {
      return res.status(400).json(
        new ApiResponseBuilder()
          .setStatusCode(400)
          .setCode('BAD_REQUEST')
          .setMessage(`Duplicate seat numbers found: ${duplicateSeatNumbers.join(', ')}`)
          .build(),
      )
    }

    // Check if any seat numbers already exist for this vehicle type
    const existingSeats = await prisma.seatConfigurations.findMany({
      where: {
        vehicleTypeId: parseInt(vehicleTypeId),
        seatNumber: { in: seatNumbers },
      },
    })

    if (existingSeats.length > 0) {
      const existingSeatNumbers = existingSeats.map((seat) => seat.seatNumber)
      return res.status(409).json(
        new ApiResponseBuilder()
          .setStatusCode(409)
          .setCode('CONFLICT')
          .setMessage(`Seat numbers already exist: ${existingSeatNumbers.join(', ')}`)
          .build(),
      )
    }

    // Create seat configurations
    const createdSeatConfigs = await prisma.seatConfigurations.createMany({
      data: validatedConfigs,
    })

    // Fetch created seat configurations
    const seatConfigs = await prisma.seatConfigurations.findMany({
      where: {
        vehicleTypeId: parseInt(vehicleTypeId),
        seatNumber: { in: seatNumbers },
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

    return res.status(201).json(
      new ApiResponseBuilder()
        .setStatusCode(201)
        .setCode('SUCCESS')
        .setMessage('Seat configurations created successfully')
        .setData({
          created: createdSeatConfigs.count,
          seatConfigurations: seatConfigs,
        })
        .build(),
    )
  } catch (error) {
    console.error('Bulk create seat configurations error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to create seat configurations')
          .build(),
      )
  }
}

async function bulkUpdateSeatConfigurations(req: NextApiRequest, res: NextApiResponse) {
  const { updates } = req.body

  try {
    // Validate required fields
    if (!updates || !Array.isArray(updates)) {
      return res
        .status(400)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(400)
            .setCode('BAD_REQUEST')
            .setMessage('Missing required field: updates array')
            .build(),
        )
    }

    const results = []
    const errors = []

    // Process each update
    for (const update of updates) {
      try {
        const { seatConfigId, seatNumber, rowNumber, columnNumber, isAvailable } = update

        if (!seatConfigId) {
          errors.push({ seatConfigId, error: 'Missing seatConfigId' })
          continue
        }

        // Check if seat configuration exists
        const existingSeatConfig = await prisma.seatConfigurations.findUnique({
          where: { seatConfigId: parseInt(seatConfigId) },
        })

        if (!existingSeatConfig) {
          errors.push({ seatConfigId, error: 'Seat configuration not found' })
          continue
        }

        // Check for conflicts if seat number is being changed
        if (seatNumber && seatNumber !== existingSeatConfig.seatNumber) {
          const conflictingSeat = await prisma.seatConfigurations.findFirst({
            where: {
              vehicleTypeId: existingSeatConfig.vehicleTypeId,
              seatNumber: seatNumber.toString(),
              seatConfigId: { not: parseInt(seatConfigId) },
            },
          })

          if (conflictingSeat) {
            errors.push({ seatConfigId, error: 'Seat number already exists for this vehicle type' })
            continue
          }
        }

        // Update seat configuration
        const updatedSeatConfig = await prisma.seatConfigurations.update({
          where: { seatConfigId: parseInt(seatConfigId) },
          data: {
            seatNumber:
              seatNumber !== undefined ? seatNumber.toString() : existingSeatConfig.seatNumber,
            rowNumber: rowNumber !== undefined ? parseInt(rowNumber) : existingSeatConfig.rowNumber,
            columnNumber:
              columnNumber !== undefined ? parseInt(columnNumber) : existingSeatConfig.columnNumber,
            isAvailable:
              isAvailable !== undefined ? Boolean(isAvailable) : existingSeatConfig.isAvailable,
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

        results.push(updatedSeatConfig)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        errors.push({ seatConfigId: update.seatConfigId, error: errorMessage })
      }
    }

    return res.status(200).json(
      new ApiResponseBuilder()
        .setStatusCode(200)
        .setCode('SUCCESS')
        .setMessage('Bulk update completed')
        .setData({
          updated: results.length,
          failed: errors.length,
          results,
          errors,
        })
        .build(),
    )
  } catch (error) {
    console.error('Bulk update seat configurations error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to update seat configurations')
          .build(),
      )
  }
}

async function bulkDeleteSeatConfigurations(req: NextApiRequest, res: NextApiResponse) {
  const { seatConfigIds } = req.body

  try {
    // Validate required fields
    if (!seatConfigIds || !Array.isArray(seatConfigIds)) {
      return res
        .status(400)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(400)
            .setCode('BAD_REQUEST')
            .setMessage('Missing required field: seatConfigIds array')
            .build(),
        )
    }

    const results = []
    const errors = []

    // Process each deletion
    for (const seatConfigId of seatConfigIds) {
      try {
        // Check if seat configuration exists
        const existingSeatConfig = await prisma.seatConfigurations.findUnique({
          where: { seatConfigId: parseInt(seatConfigId) },
        })

        if (!existingSeatConfig) {
          errors.push({ seatConfigId, error: 'Seat configuration not found' })
          continue
        }

        // Check if seat is being used in any trips
        const usedInTrips = await prisma.tripSeats.findFirst({
          where: { seatNumber: existingSeatConfig.seatNumber },
        })

        if (usedInTrips) {
          errors.push({
            seatConfigId,
            error: 'Cannot delete seat configuration that is being used in trips',
          })
          continue
        }

        // Delete seat configuration
        await prisma.seatConfigurations.delete({
          where: { seatConfigId: parseInt(seatConfigId) },
        })

        results.push({ seatConfigId, status: 'deleted' })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        errors.push({ seatConfigId, error: errorMessage })
      }
    }

    return res.status(200).json(
      new ApiResponseBuilder()
        .setStatusCode(200)
        .setCode('SUCCESS')
        .setMessage('Bulk deletion completed')
        .setData({
          deleted: results.length,
          failed: errors.length,
          results,
          errors,
        })
        .build(),
    )
  } catch (error) {
    console.error('Bulk delete seat configurations error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to delete seat configurations')
          .build(),
      )
  }
}
