import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponseBuilder } from '@/shared/utils/ApiResponseBuilder'
import prisma from '@/configs/prisma/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const ticketId = parseInt(id as string)

  if (isNaN(ticketId)) {
    return res
      .status(400)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(400)
          .setCode('BAD_REQUEST')
          .setMessage('Invalid ticket ID')
          .build(),
      )
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getTicketById(ticketId, res)
      case 'PUT':
        return await updateTicket(ticketId, req, res)
      case 'DELETE':
        return await deleteTicket(ticketId, res)
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
    console.error('Ticket API Error:', error)
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

async function getTicketById(ticketId: number, res: NextApiResponse) {
  try {
    const ticket = await prisma.tickets.findUnique({
      where: { ticketId },
      include: {
        user: {
          select: {
            userId: true,
            name: true,
            email: true,
            phone: true,
            dateOfBirth: true,
            address: true,
          },
        },
        trip: {
          include: {
            vehicle: {
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
            },
            driver: {
              select: {
                userId: true,
                name: true,
                phone: true,
                email: true,
              },
            },
            tripStops: {
              include: {
                location: {
                  select: {
                    locationId: true,
                    detail: true,
                    province: true,
                  },
                },
              },
              orderBy: { stopOrder: 'asc' },
            },
          },
        },
        pickupStop: {
          include: {
            location: {
              select: {
                locationId: true,
                detail: true,
                province: true,
              },
            },
          },
        },
        dropoffStop: {
          include: {
            location: {
              select: {
                locationId: true,
                detail: true,
                province: true,
              },
            },
          },
        },
        payments: {
          select: {
            paymentId: true,
            amount: true,
            method: true,
            paidAt: true,
            createdAt: true,
          },
          orderBy: { paidAt: 'desc' },
        },
        tripSeats: {
          select: {
            tripId: true,
            seatNumber: true,
            isBooked: true,
          },
        },
      },
    })

    if (!ticket) {
      return res
        .status(404)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(404)
            .setCode('NOT_FOUND')
            .setMessage('Ticket not found')
            .build(),
        )
    }

    return res
      .status(200)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(200)
          .setCode('SUCCESS')
          .setMessage('Ticket retrieved successfully')
          .setData(ticket)
          .build(),
      )
  } catch (error) {
    console.error('Get ticket by ID error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to retrieve ticket')
          .build(),
      )
  }
}

async function updateTicket(ticketId: number, req: NextApiRequest, res: NextApiResponse) {
  const { status, seatNumber } = req.body

  try {
    // Check if ticket exists
    const existingTicket = await prisma.tickets.findUnique({
      where: { ticketId },
      include: { tripSeats: true },
    })

    if (!existingTicket) {
      return res
        .status(404)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(404)
            .setCode('NOT_FOUND')
            .setMessage('Ticket not found')
            .build(),
        )
    }

    // Update ticket
    const updatedTicket = await prisma.tickets.update({
      where: { ticketId },
      data: {
        ...(status && { status }),
        ...(seatNumber && { seatNumber: seatNumber.toString() }),
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            userId: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        trip: {
          include: {
            vehicle: {
              include: {
                vehicleType: true,
              },
            },
            driver: {
              select: {
                userId: true,
                name: true,
                phone: true,
              },
            },
          },
        },
        pickupStop: {
          include: {
            location: true,
          },
        },
        dropoffStop: {
          include: {
            location: true,
          },
        },
        payments: {
          select: {
            paymentId: true,
            amount: true,
            method: true,
            paidAt: true,
          },
          orderBy: { paidAt: 'desc' },
        },
      },
    })

    // Update trip seat if seat number changed
    if (seatNumber && seatNumber !== existingTicket.seatNumber) {
      // Remove old seat booking
      await prisma.tripSeats.deleteMany({
        where: {
          tripId: existingTicket.tripId,
          seatNumber: existingTicket.seatNumber,
        },
      })

      // Create new seat booking
      await prisma.tripSeats.create({
        data: {
          tripId: existingTicket.tripId,
          seatNumber: seatNumber.toString(),
          isBooked: true,
          ticketId: ticketId,
        },
      })
    }

    return res
      .status(200)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(200)
          .setCode('SUCCESS')
          .setMessage('Ticket updated successfully')
          .setData(updatedTicket)
          .build(),
      )
  } catch (error) {
    console.error('Update ticket error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to update ticket')
          .build(),
      )
  }
}

async function deleteTicket(ticketId: number, res: NextApiResponse) {
  try {
    // Check if ticket exists
    const existingTicket = await prisma.tickets.findUnique({
      where: { ticketId },
    })

    if (!existingTicket) {
      return res
        .status(404)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(404)
            .setCode('NOT_FOUND')
            .setMessage('Ticket not found')
            .build(),
        )
    }

    // Soft delete by setting status to cancelled
    await prisma.tickets.update({
      where: { ticketId },
      data: {
        status: 'cancelled',
        updatedAt: new Date(),
      },
    })

    // Free up the seat
    await prisma.tripSeats.updateMany({
      where: {
        tripId: existingTicket.tripId,
        seatNumber: existingTicket.seatNumber,
      },
      data: {
        isBooked: false,
        ticketId: null,
      },
    })

    return res
      .status(200)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(200)
          .setCode('SUCCESS')
          .setMessage('Ticket cancelled successfully')
          .build(),
      )
  } catch (error) {
    console.error('Delete ticket error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to cancel ticket')
          .build(),
      )
  }
}
