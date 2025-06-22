'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { LoadingIndicator } from '@/components/Common/LoadingIndicator'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Search, Filter } from 'lucide-react'
import { TicketApi, Ticket, TicketStatus } from '@/feature/Admin/apis/TicketApi'
import { TicketDetailDialog } from '@/feature/Admin/components/tickets/TicketDetailDialog'
import { toast } from 'sonner'

const TicketsList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showTicketDetail, setShowTicketDetail] = useState(false)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ticketApi = React.useMemo(() => new TicketApi(), [])

  // Fetch tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = {
          page: 1,
          limit: 100,
          status: statusFilter as TicketStatus | 'all',
          search: searchTerm || undefined,
        }

        console.log('Fetching tickets with params:', params)
        const response = await ticketApi.getTickets(params)
        console.log('Tickets response:', response)

        if (response.code === 'SUCCESS' && response.data) {
          setTickets(response.data.items || [])
          console.log('Tickets loaded:', response.data.items?.length || 0)
        } else {
          console.warn('Failed to fetch tickets:', response.message)
          setTickets([])
          setError('Failed to load tickets')
        }
      } catch (err) {
        console.error('Failed to fetch tickets:', err)
        setError('Failed to load tickets')
        setTickets([])
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [ticketApi, statusFilter, searchTerm])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const getStatusBadgeVariant = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.booked:
        return 'secondary' as const
      case TicketStatus.cancelled:
        return 'destructive' as const
      case TicketStatus.completed:
        return 'default' as const
      case TicketStatus.refunded:
        return 'outline' as const
      default:
        return 'secondary' as const
    }
  }

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setShowTicketDetail(true)
  }

  const handleSendNotification = async (ticket: Ticket) => {
    try {
      console.log('Send notification for ticket:', ticket.ticketId)
      // TODO: Implement notification API
      toast.success(`Notification sent to ${ticket.user?.name}`)
    } catch (error) {
      console.error('Failed to send notification:', error)
      toast.error('Failed to send notification')
    }
  }

  const handleCancelTicket = async (ticket: Ticket) => {
    try {
      console.log('Cancel ticket:', ticket.ticketId)
      const response = await ticketApi.cancelTicket(ticket.ticketId)

      if (response.code === 'SUCCESS') {
        toast.success(`Ticket #${ticket.ticketId} has been cancelled`)
        // Refresh tickets list
        const updatedTickets = tickets.map((t) =>
          t.ticketId === ticket.ticketId ? { ...t, status: TicketStatus.cancelled } : t,
        )
        setTickets(updatedTickets)
      } else {
        toast.error('Failed to cancel ticket')
      }
    } catch (error) {
      console.error('Failed to cancel ticket:', error)
      toast.error('Failed to cancel ticket')
    }
  }

  const handleProcessRefund = async (ticket: Ticket) => {
    try {
      console.log('Process refund for ticket:', ticket.ticketId)
      const response = await ticketApi.updateTicket(ticket.ticketId, {
        status: TicketStatus.refunded,
      })

      if (response.code === 'SUCCESS') {
        toast.success(`Refund processed for ticket #${ticket.ticketId}`)
        // Refresh tickets list
        const updatedTickets = tickets.map((t) =>
          t.ticketId === ticket.ticketId ? { ...t, status: TicketStatus.refunded } : t,
        )
        setTickets(updatedTickets)
      } else {
        toast.error('Failed to process refund')
      }
    } catch (error) {
      console.error('Failed to process refund:', error)
      toast.error('Failed to process refund')
    }
  }

  if (loading && tickets.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <LoadingIndicator />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-red-600">
            <p>Error: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by passenger name, email, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={TicketStatus.booked}>Booked</SelectItem>
                <SelectItem value={TicketStatus.completed}>Completed</SelectItem>
                <SelectItem value={TicketStatus.cancelled}>Cancelled</SelectItem>
                <SelectItem value={TicketStatus.refunded}>Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tickets ({tickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <LoadingIndicator />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Passenger</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Seat</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow
                    key={ticket.ticketId}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleTicketClick(ticket)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://avatar.vercel.sh/${ticket.user?.email}`} />
                          <AvatarFallback>
                            {ticket.user?.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{ticket.user?.name}</div>
                          <div className="text-sm text-gray-500">{ticket.user?.email}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {ticket.pickupStop?.location?.detail} →{' '}
                          {ticket.dropoffStop?.location?.detail}
                        </div>
                        <div className="text-xs text-gray-500">
                          {ticket.pickupStop?.location?.province} →{' '}
                          {ticket.dropoffStop?.location?.province}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="font-mono">{ticket.seatNumber}</TableCell>

                    <TableCell className="font-medium">{formatCurrency(ticket.price)}</TableCell>

                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(ticket.status)}>
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleTicketClick(ticket)
                            }}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSendNotification(ticket)
                            }}
                          >
                            Send Notification
                          </DropdownMenuItem>
                          {ticket.status === TicketStatus.booked && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCancelTicket(ticket)
                              }}
                            >
                              Cancel Ticket
                            </DropdownMenuItem>
                          )}
                          {ticket.status === TicketStatus.completed && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleProcessRefund(ticket)
                              }}
                            >
                              Process Refund
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Ticket Detail Dialog */}
      <TicketDetailDialog
        ticket={selectedTicket}
        open={showTicketDetail}
        onOpenChange={setShowTicketDetail}
      />
    </div>
  )
}

export { TicketsList }
