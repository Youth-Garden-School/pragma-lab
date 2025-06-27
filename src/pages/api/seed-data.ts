import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponseBuilder } from '@/shared/utils/ApiResponseBuilder'
import prisma from '@/configs/prisma/prisma'
import { Role, TripStatus, TicketStatus, PaymentMethod } from '@prisma/client'

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
    // Clear existing data (optional - be careful in production)
    await prisma.payments.deleteMany()
    await prisma.tripSeats.deleteMany()
    await prisma.tickets.deleteMany()
    await prisma.tripStops.deleteMany()
    await prisma.trips.deleteMany()
    await prisma.vehicles.deleteMany()
    await prisma.seatConfigurations.deleteMany()
    await prisma.vehicleTypes.deleteMany()
    await prisma.locations.deleteMany()
    await prisma.users.deleteMany()

    // Create users
    const users = await Promise.all([
      prisma.users.create({
        data: {
          phone: '0123456789',
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'hashed_password_here',
          role: Role.admin,
          address: 'Hanoi, Vietnam',
        },
      }),
      prisma.users.create({
        data: {
          phone: '0987654321',
          name: 'Driver Nguyen Van A',
          email: 'driver1@example.com',
          password: 'hashed_password_here',
          role: Role.employee,
          address: 'Hanoi, Vietnam',
        },
      }),
      prisma.users.create({
        data: {
          phone: '0111222333',
          name: 'Driver Tran Thi B',
          email: 'driver2@example.com',
          password: 'hashed_password_here',
          role: Role.employee,
          address: 'Ho Chi Minh City, Vietnam',
        },
      }),
      prisma.users.create({
        data: {
          phone: '0444555666',
          name: 'Customer Le Van C',
          email: 'customer1@example.com',
          password: 'hashed_password_here',
          role: Role.customer,
          address: 'Da Nang, Vietnam',
        },
      }),
    ])

    // Create locations
    const locations = await Promise.all([
      prisma.locations.create({
        data: {
          detail: 'Ben xe Mien Dong',
          province: 'Ho Chi Minh City',
        },
      }),
      prisma.locations.create({
        data: {
          detail: 'Ben xe Mien Bac',
          province: 'Hanoi',
        },
      }),
      prisma.locations.create({
        data: {
          detail: 'Ben xe Da Nang',
          province: 'Da Nang',
        },
      }),
      prisma.locations.create({
        data: {
          detail: 'Ben xe Hue',
          province: 'Thua Thien Hue',
        },
      }),
    ])

    // Create vehicle types
    const vehicleTypes = await Promise.all([
      prisma.vehicleTypes.create({
        data: {
          name: 'Xe Limousine 22 chỗ',
          seatCapacity: 22,
          pricePerSeat: 250000,
        },
      }),
      prisma.vehicleTypes.create({
        data: {
          name: 'Xe Limousine 45 chỗ',
          seatCapacity: 45,
          pricePerSeat: 200000,
        },
      }),
    ])

    // Create seat configurations for Limousine 22 chỗ
    const seatConfigs22 = []
    for (let row = 1; row <= 6; row++) {
      for (let col = 1; col <= 4; col++) {
        if (row === 6 && col > 2) continue // Last row only has 2 seats
        seatConfigs22.push({
          vehicleTypeId: vehicleTypes[0].vehicleTypeId,
          seatNumber: `L${row}${col}`,
          rowNumber: row,
          columnNumber: col,
          isAvailable: true,
        })
      }
    }

    await prisma.seatConfigurations.createMany({
      data: seatConfigs22,
    })

    // Create seat configurations for Limousine 45 chỗ
    const seatConfigs45 = []
    for (let row = 1; row <= 12; row++) {
      for (let col = 1; col <= 4; col++) {
        if (row === 12 && col > 1) continue // Last row only has 1 seat
        seatConfigs45.push({
          vehicleTypeId: vehicleTypes[1].vehicleTypeId,
          seatNumber: `L${row}${col}`,
          rowNumber: row,
          columnNumber: col,
          isAvailable: true,
        })
      }
    }

    await prisma.seatConfigurations.createMany({
      data: seatConfigs45,
    })

    // Create vehicles
    const vehicles = await Promise.all([
      prisma.vehicles.create({
        data: {
          licensePlate: '30A-12345',
          vehicleTypeId: vehicleTypes[0].vehicleTypeId,
        },
      }),
      prisma.vehicles.create({
        data: {
          licensePlate: '51B-67890',
          vehicleTypeId: vehicleTypes[1].vehicleTypeId,
        },
      }),
    ])

    // Create trips
    const trips = await Promise.all([
      prisma.trips.create({
        data: {
          vehicleId: vehicles[0].vehicleId,
          driverId: users[1].userId, // Driver Nguyen Van A
          status: TripStatus.upcoming,
          note: 'Chuyến đi từ HCM đến Hanoi',
          tripStops: {
            create: [
              {
                locationId: locations[0].locationId, // Ben xe Mien Dong
                stopOrder: 1,
                arrivalTime: new Date('2024-01-15T06:00:00Z'),
                departureTime: new Date('2024-01-15T06:30:00Z'),
                isPickup: true,
              },
              {
                locationId: locations[1].locationId, // Ben xe Mien Bac
                stopOrder: 2,
                arrivalTime: new Date('2024-01-15T14:00:00Z'),
                departureTime: new Date('2024-01-15T14:30:00Z'),
                isPickup: false,
              },
            ],
          },
        },
      }),
      prisma.trips.create({
        data: {
          vehicleId: vehicles[1].vehicleId,
          driverId: users[2].userId, // Driver Tran Thi B
          status: TripStatus.ongoing,
          note: 'Chuyến đi từ Hanoi đến Da Nang',
          tripStops: {
            create: [
              {
                locationId: locations[1].locationId, // Ben xe Mien Bac
                stopOrder: 1,
                arrivalTime: new Date('2024-01-15T08:00:00Z'),
                departureTime: new Date('2024-01-15T08:30:00Z'),
                isPickup: true,
              },
              {
                locationId: locations[2].locationId, // Ben xe Da Nang
                stopOrder: 2,
                arrivalTime: new Date('2024-01-15T16:00:00Z'),
                departureTime: new Date('2024-01-15T16:30:00Z'),
                isPickup: false,
              },
            ],
          },
        },
      }),
    ])

    // Create trip seats for the first trip
    const tripStops1 = await prisma.tripStops.findMany({
      where: { tripId: trips[0].tripId },
      orderBy: { stopOrder: 'asc' },
    })

    const tripSeatsData = []
    for (let i = 1; i <= 22; i++) {
      tripSeatsData.push({
        tripId: trips[0].tripId,
        seatNumber: `L${Math.ceil(i / 4)}${((i - 1) % 4) + 1}`,
        isBooked: i <= 5, // First 5 seats are booked
        ticketId: null, // Set to null initially
      })
    }

    await prisma.tripSeats.createMany({
      data: tripSeatsData,
    })

    // Create tickets for the first trip
    const tickets = await Promise.all([
      prisma.tickets.create({
        data: {
          userId: users[3].userId, // Customer Le Van C
          tripId: trips[0].tripId,
          pickupStopId: tripStops1[0].tripStopId,
          dropoffStopId: tripStops1[1].tripStopId,
          seatNumber: 'L11',
          price: 250000,
          status: TicketStatus.booked,
        },
      }),
      prisma.tickets.create({
        data: {
          userId: users[3].userId, // Customer Le Van C
          tripId: trips[0].tripId,
          pickupStopId: tripStops1[0].tripStopId,
          dropoffStopId: tripStops1[1].tripStopId,
          seatNumber: 'L12',
          price: 250000,
          status: TicketStatus.booked,
        },
      }),
    ])

    // Update trip seats with ticket IDs
    await prisma.tripSeats.updateMany({
      where: {
        tripId: trips[0].tripId,
        seatNumber: { in: ['L11', 'L12'] },
      },
      data: {
        ticketId: tickets[0].ticketId,
      },
    })

    // Update the second ticket's trip seat
    await prisma.tripSeats.update({
      where: {
        tripId_seatNumber: {
          tripId: trips[0].tripId,
          seatNumber: 'L12',
        },
      },
      data: {
        ticketId: tickets[1].ticketId,
      },
    })

    // Create payments
    await prisma.payments.create({
      data: {
        ticketId: tickets[0].ticketId,
        amount: 250000,
        method: PaymentMethod.momo,
        paidAt: new Date(),
      },
    })

    return res.status(200).json(
      new ApiResponseBuilder()
        .setStatusCode(200)
        .setCode('SUCCESS')
        .setMessage('Sample data seeded successfully')
        .setData({
          users: users.length,
          locations: locations.length,
          vehicleTypes: vehicleTypes.length,
          vehicles: vehicles.length,
          trips: trips.length,
          tickets: tickets.length,
        })
        .build(),
    )
  } catch (error) {
    console.error('Seed data error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Failed to seed sample data')
          .build(),
      )
  }
}
