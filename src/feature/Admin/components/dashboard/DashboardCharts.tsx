'use client'

import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts'
import { mockTrips, mockPayments, TripStatus } from '@/feature/Admin/data/mockData'

interface RevenueData {
  day: string
  revenue: number
}

interface TripStatusData {
  name: string
  value: number
  color: string
}

const revenueData: RevenueData[] = [
  { day: 'Mon', revenue: 120000 },
  { day: 'Tue', revenue: 180000 },
  { day: 'Wed', revenue: 250000 },
  { day: 'Thu', revenue: 150000 },
  { day: 'Fri', revenue: 300000 },
  { day: 'Sat', revenue: 280000 },
  { day: 'Sun', revenue: 220000 },
]

const tripStatusData: TripStatusData[] = [
  {
    name: 'Upcoming',
    value: mockTrips.filter((t) => t.status === TripStatus.upcoming).length,
    color: '#3b82f6',
  },
  {
    name: 'Ongoing',
    value: mockTrips.filter((t) => t.status === TripStatus.ongoing).length,
    color: '#10b981',
  },
  {
    name: 'Completed',
    value: mockTrips.filter((t) => t.status === TripStatus.completed).length,
    color: '#8b5cf6',
  },
  {
    name: 'Cancelled',
    value: mockTrips.filter((t) => t.status === TripStatus.cancelled).length,
    color: '#ef4444',
  },
  {
    name: 'Delayed',
    value: mockTrips.filter((t) => t.status === TripStatus.delayed).length,
    color: '#f59e0b',
  },
]

const formatRevenue = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value)
}

export const DashboardCharts = () => {
  const memoizedTripStatusData = useMemo(() => tripStatusData, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Analytics Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="revenue">Revenue Trend</TabsTrigger>
            <TabsTrigger value="trips">Trip Status</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#6B7280" tick={{ fill: '#6B7280' }} />
                  <YAxis
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280' }}
                    tickFormatter={formatRevenue}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatRevenue(value), 'Revenue']}
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="trips" className="space-y-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={memoizedTripStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }: TripStatusData) => `${name}: ${value}`}
                  >
                    {memoizedTripStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [value, 'Trips']}
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default DashboardCharts
