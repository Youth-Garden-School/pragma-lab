'use client'

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { QrCode, MapPin, Clock, CreditCard, User, Bell } from 'lucide-react';
import { mockNotifications } from '@/feature/Admin/data/mockData';
import { toast } from 'sonner';

interface TicketDetailDialogProps {
  ticket: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TicketDetailDialog = ({ ticket, open, onOpenChange }: TicketDetailDialogProps) => {
  if (!ticket) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const ticketNotifications = mockNotifications.filter(n => n.ticketId === ticket.ticketId);

  const handleSendNotification = () => {
    console.log('Send notification for ticket:', ticket.ticketId);
    toast.success(`Notification sent to ${ticket.user?.name}`);
  };

  const handlePrintTicket = () => {
    console.log('Print ticket:', ticket.ticketId);
    toast.success(`Ticket #${ticket.ticketId} sent to printer`);
  };

  const handleCancelTicket = () => {
    console.log('Cancel ticket:', ticket.ticketId);
    toast.success(`Ticket #${ticket.ticketId} has been cancelled`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ticket Details #{ticket.ticketId}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="ticket-info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ticket-info">Ticket Info</TabsTrigger>
            <TabsTrigger value="passenger-info">Passenger Info</TabsTrigger>
            <TabsTrigger value="payment-history">Payment History</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="ticket-info" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ticket Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    Ticket Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Ticket ID:</span>
                    <span className="text-sm">#{ticket.ticketId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Seat Number:</span>
                    <span className="text-sm font-mono">{ticket.seatNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Price:</span>
                    <span className="text-sm font-medium">{formatCurrency(ticket.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant={ticket.status === 'booked' ? 'secondary' : 
                                  ticket.status === 'cancelled' ? 'destructive' : 
                                  ticket.status === 'completed' ? 'default' : 'outline'}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Created:</span>
                    <span className="text-sm">{new Date(ticket.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Route Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Route Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Pickup Location:</div>
                    <div className="text-sm text-gray-600">
                      {ticket.pickupLocation?.detail}
                    </div>
                    <div className="text-xs text-gray-500">
                      {ticket.pickupLocation?.province}
                    </div>
                  </div>
                  <div className="border-l-2 border-gray-200 pl-4 ml-2">
                    <div className="text-sm font-medium mb-2">Dropoff Location:</div>
                    <div className="text-sm text-gray-600">
                      {ticket.dropoffLocation?.detail}
                    </div>
                    <div className="text-xs text-gray-500">
                      {ticket.dropoffLocation?.province}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* QR Code Placeholder
            <Card>
              <CardHeader>
                <CardTitle>Ticket QR Code</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                <div className="w-48 h-48 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg">
                  <div className="text-center text-gray-500">
                    <QrCode className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">QR Code for Ticket #{ticket.ticketId}</p>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleSendNotification}>
                Send Notification
              </Button>
              <Button variant="outline" onClick={handlePrintTicket}>
                Print Ticket
              </Button>
              {ticket.status === 'booked' && (
                <Button variant="destructive" onClick={handleCancelTicket}>
                  Cancel Ticket
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="passenger-info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Passenger Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://avatar.vercel.sh/${ticket.user?.email}`} />
                    <AvatarFallback className="text-lg">
                      {ticket.user?.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{ticket.user?.name}</h3>
                    <p className="text-gray-600">{ticket.user?.email}</p>
                    <p className="text-gray-600">{ticket.user?.phone}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <div className="text-sm font-medium">Date of Birth:</div>
                    <div className="text-sm text-gray-600">
                      {ticket.user?.dateOfBirth ? new Date(ticket.user.dateOfBirth).toLocaleDateString('vi-VN') : 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Address:</div>
                    <div className="text-sm text-gray-600">{ticket.user?.address || 'Not provided'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Role:</div>
                    <Badge variant="secondary">{ticket.user?.role}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment-history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ticket.payments && ticket.payments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payment ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ticket.payments.map((payment: any) => (
                        <TableRow key={payment.paymentId}>
                          <TableCell>#{payment.paymentId}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(payment.paidAt).toLocaleString('vi-VN')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No payment records found for this ticket.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ticketNotifications.length > 0 ? (
                  <div className="space-y-4">
                    {ticketNotifications.map((notification) => (
                      <div key={notification.notificationId} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={notification.status === 'sent' ? 'default' : 
                                        notification.status === 'failed' ? 'destructive' : 'secondary'}>
                            {notification.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(notification.sentAt).toLocaleString('vi-VN')}
                          </span>
                        </div>
                        <div className="text-sm font-medium mb-1">
                          {notification.type.toUpperCase()} Notification
                        </div>
                        <div className="text-sm text-gray-600">
                          {notification.message}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No notifications sent for this ticket.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export { TicketDetailDialog };
