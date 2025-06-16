'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { mockTrips, mockVehicles, mockUsers, mockTripStops, TripStatus } from '@/feature/Admin/data/mockData';
import { TripDetailDialog } from './TripDetailDialog';
import { TripEditDialog } from './TripEditDialog';

interface TripsListProps {
  searchTerm: string;
  statusFilter: string;
  vehicleFilter: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export const TripsList = ({ searchTerm, statusFilter, vehicleFilter, dateFrom, dateTo }: TripsListProps) => {
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [showTripDetail, setShowTripDetail] = useState(false);
  const [editingTrip, setEditingTrip] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Create trips with full joined data
  const tripsWithDetails = mockTrips.map(trip => {
    const vehicle = mockVehicles.find(v => v.vehicleId === trip.vehicleId);
    const driver = mockUsers.find(u => u.userId === trip.driverId);
    const tripStops = mockTripStops.filter(ts => ts.tripId === trip.tripId);
    const firstStop = tripStops.find(ts => ts.stopOrder === 1);
    
    return {
      ...trip,
      vehicle,
      driver,
      tripStops,
      departureTime: firstStop?.departureTime
    };
  });

  // Filter trips
  const filteredTrips = tripsWithDetails.filter(trip => {
    const matchesSearch = !searchTerm || 
      trip.vehicle?.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driver?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
    const matchesVehicle = vehicleFilter === 'all' || trip.vehicleId.toString() === vehicleFilter;
    
    return matchesSearch && matchesStatus && matchesVehicle;
  });

  const getStatusBadgeVariant = (status: TripStatus) => {
    switch (status) {
      case TripStatus.upcoming:
        return 'default' as const;
      case TripStatus.ongoing:
        return 'secondary' as const;
      case TripStatus.completed:
        return 'outline' as const;
      case TripStatus.cancelled:
        return 'destructive' as const;
      case TripStatus.delayed:
        return 'secondary' as const;
      default:
        return 'default' as const;
    }
  };

  const handleTripClick = (trip: any) => {
    setSelectedTrip(trip);
    setShowTripDetail(true);
  };

  const handleEditTrip = (trip: any) => {
    setEditingTrip(trip);
    setShowEditDialog(true);
  };

  const handleDeleteTrip = (tripId: number) => {
    console.log('Delete trip:', tripId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Trips ({filteredTrips.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrips.map((trip) => (
                <TableRow 
                  key={trip.tripId} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleTripClick(trip)}
                >
                  <TableCell className="font-medium">
                    {trip.vehicle?.licensePlate}
                  </TableCell>
                  
                  <TableCell>
                    {trip.driver?.name}
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(trip.status)}>
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    {trip.departureTime ? new Date(trip.departureTime).toLocaleString('vi-VN') : 'N/A'}
                  </TableCell>
                  
                  <TableCell>
                    {trip.note || 'No notes'}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleTripClick(trip); }}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditTrip(trip); }}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={(e) => { e.stopPropagation(); handleDeleteTrip(trip.tripId); }}
                        >
                          Delete
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

      {/* Trip Detail Dialog */}
      <TripDetailDialog
        trip={selectedTrip}
        open={showTripDetail}
        onOpenChange={setShowTripDetail}
      />

      {/* Trip Edit Dialog */}
      <TripEditDialog
        trip={editingTrip}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </div>
  );
};
