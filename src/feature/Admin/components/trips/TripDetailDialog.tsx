'use client'
import React, { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, Users, Car, User, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { 
  mockVehicles, 
  mockVehicleTypes, 
  mockUsers, 
  mockTripStops, 
  mockLocations, 
  mockTickets 
} from '@/feature/Admin/data/mockData';

interface TripDetailDialogProps {
  trip: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TripDetailDialog = ({ trip, open, onOpenChange }: TripDetailDialogProps) => {
  const enrichedTrip = useMemo(() => {
    if (!trip) return null;

    // Get vehicle with type
    const vehicle = mockVehicles.find(v => v.vehicleId === trip.vehicleId);
    const vehicleType = vehicle ? mockVehicleTypes.find(vt => vt.vehicleTypeId === vehicle.vehicleTypeId) : null;
    
    // Get driver
    const driver = mockUsers.find(u => u.userId === trip.driverId);
    
    // Get trip stops with locations
    const tripStops = mockTripStops
      .filter(ts => ts.tripId === trip.tripId)
      .map(stop => ({
        ...stop,
        location: mockLocations.find(l => l.locationId === stop.locationId)
      }))
      .sort((a, b) => a.stopOrder - b.stopOrder);
    
    // Get tickets with users
    const tickets = mockTickets
      .filter(t => t.tripId === trip.tripId)
      .map(ticket => ({
        ...ticket,
        user: mockUsers.find(u => u.userId === ticket.userId)
      }));

    return {
      ...trip,
      vehicle: vehicle ? { ...vehicle, vehicleType } : null,
      driver,
      tripStops,
      tickets
    };
  }, [trip]);

  if (!enrichedTrip) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case 'ongoing':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Ongoing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'delayed':
        return <Badge className="bg-orange-100 text-orange-800">Delayed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Trip Details - #{enrichedTrip.tripId.toString().padStart(4, '0')}</span>
            {getStatusBadge(enrichedTrip.status)}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stops">Stops</TabsTrigger>
            <TabsTrigger value="passengers">Passengers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vehicle Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">License Plate: </span>
                      <span className="font-medium">{enrichedTrip.vehicle?.licensePlate || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Vehicle Type: </span>
                      <span className="font-medium">{enrichedTrip.vehicle?.vehicleType?.name || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Seat Capacity: </span>
                      <span className="font-medium">{enrichedTrip.vehicle?.vehicleType?.seatCapacity || 'N/A'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Driver Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Driver Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://avatar.vercel.sh/${enrichedTrip.driver?.email}`} />
                      <AvatarFallback>
                        {enrichedTrip.driver?.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{enrichedTrip.driver?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{enrichedTrip.driver?.phone || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{enrichedTrip.driver?.email || 'N/A'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trip Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Trip Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Created: </span>
                      <span className="font-medium">
                        {format(new Date(enrichedTrip.createdAt), 'dd/MM/yyyy HH:mm')}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Last Updated: </span>
                      <span className="font-medium">
                        {format(new Date(enrichedTrip.updatedAt), 'dd/MM/yyyy HH:mm')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trip Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Trip Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    {enrichedTrip.note || 'No notes available for this trip.'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stops">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Trip Stops
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enrichedTrip.tripStops && enrichedTrip.tripStops.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Province</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Arrival</TableHead>
                        <TableHead>Departure</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrichedTrip.tripStops.map((stop: any) => (
                        <TableRow key={stop.tripStopId}>
                          <TableCell className="font-medium">{stop.stopOrder}</TableCell>
                          <TableCell>{stop.location?.detail || 'N/A'}</TableCell>
                          <TableCell>{stop.location?.province || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={stop.isPickup ? "default" : "secondary"}>
                              {stop.isPickup ? "Pickup" : "Drop-off"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {stop.arrivalTime ? format(new Date(stop.arrivalTime), 'dd/MM HH:mm') : '-'}
                          </TableCell>
                          <TableCell>
                            {stop.departureTime ? format(new Date(stop.departureTime), 'dd/MM HH:mm') : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No trip stops available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="passengers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Passenger Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enrichedTrip.tickets && enrichedTrip.tickets.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Passenger</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Seat</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrichedTrip.tickets.map((ticket: any) => (
                        <TableRow key={ticket.ticketId}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={`https://avatar.vercel.sh/${ticket.user?.email}`} />
                                <AvatarFallback>
                                  {ticket.user?.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{ticket.user?.name || 'N/A'}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{ticket.user?.phone || 'N/A'}</div>
                              <div className="text-gray-500">{ticket.user?.email || 'N/A'}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">{ticket.seatNumber}</TableCell>
                          <TableCell>
                            <Badge variant={ticket.status === 'booked' ? 'default' : 'secondary'}>
                              {ticket.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format(ticket.price)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No passengers booked for this trip
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default TripDetailDialog;