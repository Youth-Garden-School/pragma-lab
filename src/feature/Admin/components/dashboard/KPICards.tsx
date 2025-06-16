'use client'
import React from 'react'
import { Users, Truck, Route, Ticket, DollarSign, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  mockUsers,
  mockVehicles,
  mockTrips,
  mockTickets,
  mockPayments,
  mockLocations,
  TripStatus,
} from '@/feature/Admin/data/mockData'

const dashboardStats = {
  totalUsers: mockUsers.length,
  totalVehicles: mockVehicles.length,
  activeTrips: mockTrips.filter(
    (t) => t.status === TripStatus.upcoming || t.status === TripStatus.ongoing,
  ).length,
  totalTickets: mockTickets.length,
  revenueToday: mockPayments.reduce((sum, p) => sum + p.amount, 0),
  totalLocations: mockLocations.length,
}

const kpiData = [
  {
    title: 'Total Users',
    value: dashboardStats.totalUsers,
    icon: Users,
    color: 'text-blue-600',
  },
  {
    title: 'Total Vehicles',
    value: dashboardStats.totalVehicles,
    icon: Truck,
    color: 'text-green-600',
  },
  {
    title: 'Active Trips',
    value: dashboardStats.activeTrips,
    icon: Route,
    color: 'text-purple-600',
  },
  {
    title: 'Total Tickets',
    value: dashboardStats.totalTickets,
    icon: Ticket,
    color: 'text-orange-600',
  },
  {
    title: 'Revenue Today',
    value: `${dashboardStats.revenueToday.toLocaleString()} VND`,
    icon: DollarSign,
    color: 'text-emerald-600',
  },
  {
    title: 'Total Locations',
    value: dashboardStats.totalLocations,
    icon: MapPin,
    color: 'text-red-600',
  },
]

export const KPICards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpiData.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
