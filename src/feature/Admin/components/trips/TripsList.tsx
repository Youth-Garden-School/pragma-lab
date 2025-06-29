'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TripApi, Trip, TripStatus } from '@/feature/Admin/apis/TripApi'
import { LoadingIndicator } from '@/components/Common/LoadingIndicator'
import { format } from 'date-fns'
import { Edit, Trash2, Eye, Calendar, MapPin, Users, Car } from 'lucide-react'
import { TripEditDialog } from './TripEditDialog'
import { TripDetailDialog } from './TripDetailDialog'

interface TripsListProps {
  searchTerm: string
  statusFilter: string
  vehicleFilter: string
  dateFrom?: Date
  dateTo?: Date
}

// Constants for easy customization
const TRIPS_LIST_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  STATUS_BADGE_VARIANTS: {
    upcoming: 'default',
    ongoing: 'secondary',
    completed: 'outline',
    cancelled: 'destructive',
    delayed: 'destructive',
  } as const,
  STATUS_COLORS: {
    upcoming: 'bg-blue-100 text-blue-800',
    ongoing: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
    delayed: 'bg-yellow-100 text-yellow-800',
  } as const,
} as const

export const TripsList = ({
  searchTerm,
  statusFilter,
  vehicleFilter,
  dateFrom,
  dateTo,
}: TripsListProps) => {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(TRIPS_LIST_CONSTANTS.DEFAULT_PAGE)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTrips, setTotalTrips] = useState(0)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [viewingTrip, setViewingTrip] = useState<Trip | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const tripApi = React.useMemo(() => new TripApi(), [])

  const fetchTrips = async () => {
    try {
      setLoading(true)
      setError(null)

      const params: any = {
        page: currentPage,
        limit: TRIPS_LIST_CONSTANTS.DEFAULT_LIMIT,
      }

      if (statusFilter !== 'all') {
        params.status = statusFilter as TripStatus
      }

      if (searchTerm) {
        params.search = searchTerm
      }

      console.log('Fetching trips with params:', params)
      const response = await tripApi.getTrips(params)
      console.log('API Response:', response)

      if (response.code === 'SUCCESS' && response.data) {
        // ApiResponse<PaginatedData<Trip>> -> response.data is PaginatedData<Trip>
        setTrips(response.data.items || [])
        setTotalPages(response.data.totalPages || 1)
        setTotalTrips(response.data.total || 0)
        console.log('Trips loaded:', response.data.items?.length || 0)
      } else {
        console.warn('Failed to fetch trips:', response.message)
        setTrips([])
        setTotalPages(1)
        setTotalTrips(0)
      }
    } catch (err) {
      console.error('Failed to fetch trips:', err)
      setError('Failed to load trips')
      setTrips([])
      setTotalPages(1)
      setTotalTrips(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrips()
  }, [currentPage, searchTerm, statusFilter, vehicleFilter, dateFrom, dateTo])

  const getStatusBadgeVariant = (status: TripStatus) => {
    return TRIPS_LIST_CONSTANTS.STATUS_BADGE_VARIANTS[status] || 'default'
  }

  const getStatusColor = (status: TripStatus) => {
    return TRIPS_LIST_CONSTANTS.STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm')
  }

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip)
    setEditDialogOpen(true)
  }

  const handleDeleteTrip = async (trip: Trip) => {
    if (
      confirm(`Are you sure you want to delete Trip #${trip.tripId.toString().padStart(4, '0')}?`)
    ) {
      try {
        const response = await tripApi.deleteTrip(trip.tripId)
        if (response.code === 'SUCCESS') {
          fetchTrips() // Refresh the list
        }
      } catch (err) {
        console.error('Failed to delete trip:', err)
        setError('Failed to delete trip')
      }
    }
  }

  const handleViewTrip = async (trip: Trip) => {
    try {
      setLoading(true)
      setError(null)
      // Fetch full trip detail from API
      const response = await tripApi.getTripById(trip.tripId)
      if (response.code === 'SUCCESS' && response.data) {
        setViewingTrip(response.data)
        setDetailDialogOpen(true)
      } else {
        setError('Failed to load trip details')
      }
    } catch (err) {
      setError('Failed to load trip details')
    } finally {
      setLoading(false)
    }
  }

  const handleSeedData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/seed-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (result.code === 'SUCCESS') {
        console.log('Data seeded successfully:', result.data)
        // Refresh the trips list
        fetchTrips()
      } else {
        setError('Failed to seed data: ' + result.message)
      }
    } catch (err) {
      console.error('Failed to seed data:', err)
      setError('Failed to seed data')
    } finally {
      setLoading(false)
    }
  }

  if (loading && trips.length === 0) {
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
            <Button onClick={fetchTrips} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Trips ({totalTrips})</span>
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trips.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No trips found</p>
              <Button onClick={handleSeedData} disabled={loading}>
                {loading ? 'Seeding...' : 'Seed Sample Data'}
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trip ID</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Stops</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trips.map((trip) => (
                    <TableRow key={trip.tripId}>
                      <TableCell className="font-medium">
                        #{trip.tripId.toString().padStart(4, '0')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{trip.vehicle?.licensePlate}</div>
                            <div className="text-sm text-muted-foreground">
                              {trip.vehicle?.vehicleType?.name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{trip.driver?.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {trip.driver?.phone}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(trip.status)}
                          className={getStatusColor(trip.status)}
                        >
                          {trip.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{trip.tripStops?.length || 0} stops</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {trip._count?.tripSeats || 0} /{' '}
                            {trip.vehicle?.vehicleType?.seatCapacity || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(trip.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewTrip(trip)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditTrip(trip)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTrip(trip)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * TRIPS_LIST_CONSTANTS.DEFAULT_LIMIT + 1} to{' '}
                    {Math.min(currentPage * TRIPS_LIST_CONSTANTS.DEFAULT_LIMIT, totalTrips)} of{' '}
                    {totalTrips} trips
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <TripEditDialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open)
          if (!open) setEditingTrip(null)
        }}
        trip={editingTrip}
        onDataChanged={fetchTrips}
      />
      <TripDetailDialog
        open={detailDialogOpen}
        onOpenChange={(open) => {
          setDetailDialogOpen(open)
          if (!open) setViewingTrip(null)
        }}
        trip={viewingTrip}
      />
    </>
  )
}
