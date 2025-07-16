// pages/api/locations/export.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import prisma from '@/configs/prisma/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET'])
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    return await exportLocations(req, res)
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

async function exportLocations(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const {
      format = 'csv',
      search,
      province,
    } = req.query as {
      format?: string
      search?: string
      province?: string
    }

    const where: Record<string, any> = {}

    if (search) {
      where.detail = {
        contains: search,
        mode: 'insensitive',
      }
    }

    if (province && province !== 'All Provinces') {
      where.province = province
    }

    const locations = await prisma.locations.findMany({
      where,
      orderBy: {
        locationId: 'asc',
      },
      include: {
        tripStops: {
          select: {
            tripStopId: true,
          },
        },
      },
    })

    if (format === 'csv') {
      const csvHeader = 'ID,Location Name,Province,Active Trips\n'
      const csvRows = locations
        .map((location) => {
          const activeTripCount = location.tripStops.length
          return `${location.locationId},"${location.detail}","${location.province}",${activeTripCount}`
        })
        .join('\n')

      const csvContent = csvHeader + csvRows

      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename="locations.csv"')

      res.status(200).send(csvContent)
    } else if (format === 'json') {
      const exportData = locations.map((location) => ({
        locationId: location.locationId,
        detail: location.detail,
        province: location.province,
        activeTripsCount: location.tripStops.length,
      }))

      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Disposition', 'attachment; filename="locations.json"')

      res.status(200).json({
        success: true,
        data: exportData,
        total: exportData.length,
        exportedAt: new Date().toISOString(),
      })
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid format. Supported formats: csv, json',
      })
    }
  } catch (error) {
    console.error('Export locations error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to export locations',
    })
  }
}
