import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponseBuilder } from '@/shared/utils/ApiResponseBuilder'
import prisma from '@/configs/prisma/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res
      .status(400)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(400)
          .setCode('BAD_REQUEST')
          .setMessage('Invalid seat configuration ID')
          .build(),
      )
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getSeatConfiguration(parseInt(id), res)
      case 'PUT':
        return await updateSeatConfiguration(parseInt(id), req, res)
      case 'DELETE':
        return await deleteSeatConfiguration(parseInt(id), res)
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

async function getSeatConfiguration(seatConfigId: number, res: NextApiResponse) {
  try {
    const seatConfig = await prisma.seatConfigurations.findUnique({
      where: { seatConfigId },
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

    if (!seatConfig) {
      return res
        .status(404)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(404)
            .setCode('NOT_FOUND')
            .setMessage('Seat configuration not found')
            .build(),
        )
    }

    return res
      .status(200)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(200)
          .setCode('SUCCESS')
          .setMessage('Seat configuration retrieved successfully')
          .setData(seatConfig)
          .build(),
      )
  } catch (error) {
    console.error('Get seat configuration error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to retrieve seat configuration')
          .build(),
      )
  }
}

async function updateSeatConfiguration(
  seatConfigId: number,
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { seatNumber, rowNumber, columnNumber, isAvailable } = req.body

  try {
    // Check if seat configuration exists
    const existingSeatConfig = await prisma.seatConfigurations.findUnique({
      where: { seatConfigId },
    })

    if (!existingSeatConfig) {
      return res
        .status(404)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(404)
            .setCode('NOT_FOUND')
            .setMessage('Seat configuration not found')
            .build(),
        )
    }

    // Check if new seat number conflicts with existing one (if seat number is being changed)
    if (seatNumber && seatNumber !== existingSeatConfig.seatNumber) {
      const conflictingSeat = await prisma.seatConfigurations.findFirst({
        where: {
          vehicleTypeId: existingSeatConfig.vehicleTypeId,
          seatNumber: seatNumber.toString(),
          seatConfigId: { not: seatConfigId },
        },
      })

      if (conflictingSeat) {
        return res
          .status(409)
          .json(
            new ApiResponseBuilder()
              .setStatusCode(409)
              .setCode('CONFLICT')
              .setMessage('Seat number already exists for this vehicle type')
              .build(),
          )
      }
    }

    // Update seat configuration
    const updatedSeatConfig = await prisma.seatConfigurations.update({
      where: { seatConfigId },
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

    return res
      .status(200)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(200)
          .setCode('SUCCESS')
          .setMessage('Seat configuration updated successfully')
          .setData(updatedSeatConfig)
          .build(),
      )
  } catch (error) {
    console.error('Update seat configuration error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to update seat configuration')
          .build(),
      )
  }
}

async function deleteSeatConfiguration(seatConfigId: number, res: NextApiResponse) {
  try {
    // Check if seat configuration exists
    const existingSeatConfig = await prisma.seatConfigurations.findUnique({
      where: { seatConfigId },
    })

    if (!existingSeatConfig) {
      return res
        .status(404)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(404)
            .setCode('NOT_FOUND')
            .setMessage('Seat configuration not found')
            .build(),
        )
    }

    // Check if seat is being used in any trips
    const usedInTrips = await prisma.tripSeats.findFirst({
      where: { seatNumber: existingSeatConfig.seatNumber },
    })

    if (usedInTrips) {
      return res
        .status(409)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(409)
            .setCode('CONFLICT')
            .setMessage('Cannot delete seat configuration that is being used in trips')
            .build(),
        )
    }

    // Delete seat configuration
    await prisma.seatConfigurations.delete({
      where: { seatConfigId },
    })

    return res
      .status(200)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(200)
          .setCode('SUCCESS')
          .setMessage('Seat configuration deleted successfully')
          .build(),
      )
  } catch (error) {
    console.error('Delete seat configuration error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to delete seat configuration')
          .build(),
      )
  }
}
