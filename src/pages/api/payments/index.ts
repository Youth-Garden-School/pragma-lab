import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponseBuilder } from '@/shared/utils/ApiResponseBuilder'
import prisma from '@/configs/prisma/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await getPayments(req, res)
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
    console.error('Payments API Error:', error)
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

async function getPayments(req: NextApiRequest, res: NextApiResponse) {
  const { page = '1', limit = '50', method, search } = req.query

  try {
    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const where: any = {}
    if (method && method !== 'all') where.method = method
    if (search) {
      where.OR = [
        { paymentId: { equals: parseInt(search as string) || 0 } },
        { ticket: { user: { name: { contains: search as string, mode: 'insensitive' } } } },
        { ticket: { user: { email: { contains: search as string, mode: 'insensitive' } } } },
      ]
    }

    console.log('Querying payments with params:', { pageNum, limitNum, skip, where })

    const [payments, total] = await Promise.all([
      prisma.payments.findMany({
        where,
        include: {
          ticket: {
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
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { paidAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.payments.count({ where }),
    ])

    console.log(`Found ${payments.length} payments out of ${total} total`)

    const totalPages = Math.ceil(total / limitNum)

    return res.status(200).json(
      new ApiResponseBuilder()
        .setStatusCode(200)
        .setCode('SUCCESS')
        .setMessage('Payments retrieved successfully')
        .setData({
          items: payments,
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
        })
        .build(),
    )
  } catch (error) {
    console.error('Get payments error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to retrieve payments')
          .build(),
      )
  }
}
