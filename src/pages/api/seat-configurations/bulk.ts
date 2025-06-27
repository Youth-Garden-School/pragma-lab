import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/configs/prisma/prisma'
import { ApiResponseBuilder } from '@/shared/utils/ApiResponseBuilder'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
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
    const { vehicleTypeId, seatConfigurations } = req.body

    if (!vehicleTypeId || !seatConfigurations || !Array.isArray(seatConfigurations)) {
      return res
        .status(400)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(400)
            .setCode('BAD_REQUEST')
            .setMessage('Invalid request data')
            .build(),
        )
    }

    // Check if vehicle type exists
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

    // Delete existing seat configurations for this vehicle type
    await prisma.seatConfigurations.deleteMany({
      where: { vehicleTypeId: parseInt(vehicleTypeId) },
    })

    // Create new seat configurations
    const createdSeatConfigs = await prisma.seatConfigurations.createMany({
      data: seatConfigurations.map((config: any) => ({
        vehicleTypeId: parseInt(vehicleTypeId),
        seatNumber: config.seatNumber,
        rowNumber: config.rowNumber,
        columnNumber: config.columnNumber,
        isAvailable: config.isAvailable,
      })),
    })

    console.log(
      `Created ${createdSeatConfigs.count} seat configurations for vehicle type ${vehicleTypeId}`,
    )

    return res
      .status(200)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(200)
          .setCode('SUCCESS')
          .setMessage('Seat configurations created successfully')
          .setData({ count: createdSeatConfigs.count })
          .build(),
      )
  } catch (error) {
    console.error('Error creating seat configurations:', error)
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
