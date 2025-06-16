'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search, Filter } from 'lucide-react';
import { 
  mockTickets, 
  mockUsers, 
  mockTrips, 
  mockLocations, 
  mockTripStops, 
  mockPayments,
  TicketStatus 
} from '@/feature/Admin/data/mockData';
import { TicketDetailDialog } from '@/feature/Admin/components/tickets/TicketDetailDialog';
import { toast } from 'sonner';

const TicketsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showTicketDetail, setShowTicketDetail] = useState(false);

  // Create tickets with full joined data
  const ticketsWithDetails = mockTickets.map(ticket => {
    const user = mockUsers.find(u => u.userId === ticket.userId);
    const trip = mockTrips.find(t => t.tripId === ticket.tripId);
    
    const pickupStop = mockTripStops.find(ts => ts.tripStopId === ticket.pickupStopId);
    const dropoffStop = mockTripStops.find(ts => ts.tripStopId === ticket.dropoffStopId);
    
    const pickupLocation = pickupStop ? mockLocations.find(l => l.locationId === pickupStop.locationId) : null;
    const dropoffLocation = dropoffStop ? mockLocations.find(l => l.locationId === dropoffStop.locationId) : null;
    
    const payments = mockPayments.filter(p => p.ticketId === ticket.ticketId);

    return {
      ...ticket,
      user,
      trip,
      pickupLocation,
      dropoffLocation,
      payments
    };
  });

  // Filter tickets
  const filteredTickets = ticketsWithDetails.filter(ticket => {
    const matchesSearch = !searchTerm || 
      ticket.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.pickupLocation?.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.dropoffLocation?.detail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getStatusBadgeVariant = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.booked:
        return 'secondary' as const;
      case TicketStatus.cancelled:
        return 'destructive' as const;
      case TicketStatus.completed:
        return 'default' as const;
      case TicketStatus.refunded:
        return 'outline' as const;
      default:
        return 'secondary' as const;
    }
  };

  const handleTicketClick = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowTicketDetail(true);
  };

  const handleSendNotification = (ticket: any) => {
    console.log('Send notification for ticket:', ticket.ticketId);
    toast.success(`Notification sent to ${ticket.user?.name}`);
  };

  const handleCancelTicket = (ticket: any) => {
    console.log('Cancel ticket:', ticket.ticketId);
    toast.success(`Ticket #${ticket.ticketId} has been cancelled`);
  };

  const handleProcessRefund = (ticket: any) => {
    console.log('Process refund for ticket:', ticket.ticketId);
    toast.success(`Refund processed for ticket #${ticket.ticketId}`);
  };

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
          <CardTitle>All Tickets ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
              {filteredTickets.map((ticket) => (
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
                          {ticket.user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
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
                        {ticket.pickupLocation?.detail} → {ticket.dropoffLocation?.detail}
                      </div>
                      <div className="text-xs text-gray-500">
                        {ticket.pickupLocation?.province} → {ticket.dropoffLocation?.province}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="font-mono">{ticket.seatNumber}</TableCell>
                  
                  <TableCell className="font-medium">
                    {formatCurrency(ticket.price)}
                  </TableCell>
                  
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
                        <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleTicketClick(ticket); }}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleSendNotification(ticket); }}>
                          Send Notification
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleCancelTicket(ticket); }}>
                          Cancel Ticket
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleProcessRefund(ticket); }}>
                          Process Refund
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Ticket Detail Dialog */}
      <TicketDetailDialog
        ticket={selectedTicket}
        open={showTicketDetail}
        onOpenChange={setShowTicketDetail}
      />
    </div>
  );
};

export { TicketsList };
