import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponseBuilder } from '@/shared/utils/ApiResponseBuilder'
import prisma from '@/configs/prisma/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
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
    // Get ticket statistics
    const [total, booked, completed, cancelled, refunded, totalRevenue] = await Promise.all([
      prisma.tickets.count(),
      prisma.tickets.count({ where: { status: 'booked' } }),
      prisma.tickets.count({ where: { status: 'completed' } }),
      prisma.tickets.count({ where: { status: 'cancelled' } }),
      prisma.tickets.count({ where: { status: 'refunded' } }),
      prisma.tickets.aggregate({
        where: { status: { in: ['booked', 'completed'] } },
        _sum: { price: true },
      }),
    ])

    const statistics = {
      total,
      booked,
      completed,
      cancelled,
      refunded,
      totalRevenue: totalRevenue._sum.price || 0,
    }

    console.log('Ticket statistics:', statistics)

    return res
      .status(200)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(200)
          .setCode('SUCCESS')
          .setMessage('Ticket statistics retrieved successfully')
          .setData(statistics)
          .build(),
      )
  } catch (error) {
    console.error('Get ticket statistics error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to retrieve ticket statistics')
          .build(),
      )
  }
}
