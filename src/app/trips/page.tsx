"use client"
import React, { useState } from 'react';
import { DashboardHeader } from '@/feature/Admin/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/feature/Admin/components/dashboard/DashboardSidebar';
import { TripsList } from '@/feature/Admin/components/trips/TripsList';
import { CreateTripDialog } from '@/feature/Admin/components/trips/CreateTripDialog';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TripStatus } from '@/feature/Admin/data/mockData';

const Trips = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateTrip = () => {
    setIsCreateDialogOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar activeItem="Trips" />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <main className="flex-1 p-6">
            {/* Breadcrumb */}
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-500">Trips</span>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-900 font-medium">All Trips</span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Trip Management</h1>
                <p className="text-gray-600 mt-1">Manage all trips, routes, and schedules</p>
              </div>
              <Button onClick={handleCreateTrip} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Trip
              </Button>
            </div>

            {/* Filters Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Filters & Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Search */}
                  <div className="relative w-full max-w-md">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search trips, routes, drivers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value={TripStatus.upcoming}>Upcoming</SelectItem>
                      <SelectItem value={TripStatus.ongoing}>Ongoing</SelectItem>
                      <SelectItem value={TripStatus.completed}>Completed</SelectItem>
                      <SelectItem value={TripStatus.cancelled}>Cancelled</SelectItem>
                      <SelectItem value={TripStatus.delayed}>Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Trips List */}
            <TripsList 
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              vehicleFilter={vehicleFilter}
              dateFrom={dateFrom}
              dateTo={dateTo}
            />
          </main>
        </div>

        {/* Create Trip Dialog */}
        <CreateTripDialog 
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>
    </SidebarProvider>
  );
};

export default Trips;