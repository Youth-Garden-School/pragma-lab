import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponseBuilder } from '@/shared/utils/ApiResponseBuilder'
import prisma from '@/configs/prisma/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await getTickets(req, res)
      case 'POST':
        return await createTicket(req, res)
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
    console.error('Tickets API Error:', error)
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

async function getTickets(req: NextApiRequest, res: NextApiResponse) {
  const { page = '1', limit = '50', status, search } = req.query

  try {
    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const where: any = {}
    if (status && status !== 'all') where.status = status
    if (search) {
      where.OR = [
        { user: { name: { contains: search as string, mode: 'insensitive' } } },
        { user: { email: { contains: search as string, mode: 'insensitive' } } },
        {
          pickupStop: { location: { detail: { contains: search as string, mode: 'insensitive' } } },
        },
        {
          dropoffStop: {
            location: { detail: { contains: search as string, mode: 'insensitive' } },
          },
        },
      ]
    }

    console.log('Querying tickets with params:', { pageNum, limitNum, skip, where })

    const [tickets, total] = await Promise.all([
      prisma.tickets.findMany({
        where,
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
                },
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
            },
            orderBy: { paidAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.tickets.count({ where }),
    ])

    console.log(`Found ${tickets.length} tickets out of ${total} total`)

    const totalPages = Math.ceil(total / limitNum)

    return res.status(200).json(
      new ApiResponseBuilder()
        .setStatusCode(200)
        .setCode('SUCCESS')
        .setMessage('Tickets retrieved successfully')
        .setData({
          items: tickets,
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
        })
        .build(),
    )
  } catch (error) {
    console.error('Get tickets error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to retrieve tickets')
          .build(),
      )
  }
}

async function createTicket(req: NextApiRequest, res: NextApiResponse) {
  const { userId, tripId, pickupStopId, dropoffStopId, seatNumber, price } = req.body

  try {
    // Validate required fields
    if (!userId || !tripId || !pickupStopId || !dropoffStopId || !seatNumber || !price) {
      return res
        .status(400)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(400)
            .setCode('BAD_REQUEST')
            .setMessage('Missing required fields')
            .build(),
        )
    }

    // Check if seat is already booked for this trip
    const existingTicket = await prisma.tickets.findFirst({
      where: {
        tripId: parseInt(tripId),
        seatNumber: seatNumber.toString(),
        status: { not: 'cancelled' },
      },
    })

    if (existingTicket) {
      return res
        .status(409)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(409)
            .setCode('CONFLICT')
            .setMessage('Seat is already booked for this trip')
            .build(),
        )
    }

    // Create ticket
    const ticket = await prisma.tickets.create({
      data: {
        userId: parseInt(userId),
        tripId: parseInt(tripId),
        pickupStopId: parseInt(pickupStopId),
        dropoffStopId: parseInt(dropoffStopId),
        seatNumber: seatNumber.toString(),
        price: parseFloat(price),
        status: 'booked',
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
      },
    })

    // Create trip seat record
    await prisma.tripSeats.create({
      data: {
        tripId: parseInt(tripId),
        seatNumber: seatNumber.toString(),
        isBooked: true,
        ticketId: ticket.ticketId,
      },
    })

    return res
      .status(201)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(201)
          .setCode('SUCCESS')
          .setMessage('Ticket created successfully')
          .setData(ticket)
          .build(),
      )
  } catch (error) {
    console.error('Create ticket error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to create ticket')
          .build(),
      )
  }
}
