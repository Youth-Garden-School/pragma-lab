'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { mockTickets, mockUsers, TicketStatus } from '@/feature/Admin/data/mockData'
import { formatDistanceToNow } from 'date-fns'

export const RecentActivities = () => {
  const recentTickets = mockTickets
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const getUserName = (userId: number) => {
    const user = mockUsers.find((u) => u.userId === userId)
    return user?.name || 'Unknown User'
  }

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.booked:
        return 'text-green-600'
      case TicketStatus.cancelled:
        return 'text-red-600'
      case TicketStatus.completed:
        return 'text-blue-600'
      case TicketStatus.refunded:
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-4">
            {recentTickets.map((ticket) => (
              <div key={ticket.ticketId} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {getUserName(ticket.userId)} booked seat {ticket.seatNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {ticket.price.toLocaleString()} VND
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
