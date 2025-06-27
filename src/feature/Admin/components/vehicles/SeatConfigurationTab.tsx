'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SeatApi, SeatConfiguration, VehicleType } from '@/feature/Admin/apis/SeatApi'
import { TripApi, Trip } from '@/feature/Admin/apis/TripApi'
import {
  SEAT_STATUS,
  SEAT_STATUS_BADGE_VARIANTS,
  SEAT_STATUS_BADGE_TEXT,
  VEHICLE_TYPE_LAYOUTS,
  type SeatStatus,
} from '@/shared/constants/seatConstants'
import { LoadingIndicator } from '@/components/Common/LoadingIndicator'
import { Button } from '@/components/ui/button'

// Constants for easy customization
const SEAT_CONFIG_CONSTANTS = {
  DEFAULT_VEHICLE_TYPE: '1',
  DEFAULT_TRIP_ID: null,
  SEAT_GRID_GAP: 'gap-3',
  MAX_WIDTH: 'max-w-4xl',
  STATS_GRID_COLS: 'grid-cols-3',
  STATS_GAP: 'gap-4',
  CARD_PADDING: 'p-3',
  HOVER_EFFECT: 'hover:shadow-md',
  TRANSITION: 'transition-all',
} as const

export const SeatConfigurationTab = () => {
  const [selectedType, setSelectedType] = React.useState<string>(
    SEAT_CONFIG_CONSTANTS.DEFAULT_VEHICLE_TYPE,
  )
  const [selectedTripId, setSelectedTripId] = React.useState<string | null>(
    SEAT_CONFIG_CONSTANTS.DEFAULT_TRIP_ID,
  )
  const [seatConfigs, setSeatConfigs] = React.useState<SeatConfiguration[]>([])
  const [vehicleTypes, setVehicleTypes] = React.useState<VehicleType[]>([])
  const [trips, setTrips] = React.useState<Trip[]>([])
  const [tripSeats, setTripSeats] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const seatApi = React.useMemo(() => new SeatApi(), [])
  const tripApi = React.useMemo(() => new TripApi(), [])

  // Fetch vehicle types on component mount
  React.useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        setLoading(true)
        console.log('Fetching vehicle types...')
        const response = await seatApi.getVehicleTypes()
        console.log('Vehicle types response:', response)

        if (response.code === 'SUCCESS' && response.data) {
          console.log('Vehicle types loaded:', response.data.length)
          setVehicleTypes(response.data)
        } else {
          console.warn('Failed to fetch vehicle types:', response.message)
          setError('Failed to load vehicle types')
        }
      } catch (err) {
        console.error('Failed to fetch vehicle types:', err)
        setError('Failed to load vehicle types')
      } finally {
        setLoading(false)
      }
    }

    fetchVehicleTypes()
  }, [seatApi])

  // Fetch active trips
  React.useEffect(() => {
    const fetchActiveTrips = async () => {
      try {
        const response = await tripApi.getActiveTrips()
        if (response.code === 'SUCCESS' && response.data) {
          setTrips(response.data.items || [])
        } else {
          console.warn('Failed to fetch active trips:', response.message)
          setTrips([])
        }
      } catch (err) {
        console.error('Failed to fetch active trips:', err)
        setTrips([])
        // Don't set error for trips as it's optional
      }
    }

    fetchActiveTrips()
  }, [tripApi])

  // Fetch seat configurations when vehicle type changes
  React.useEffect(() => {
    const fetchSeatConfigurations = async () => {
      if (!selectedType) return

      try {
        setLoading(true)
        setError(null)

        console.log('Fetching seat configurations for vehicle type:', selectedType)
        const response = await seatApi.getSeatConfigurations({
          vehicleTypeId: parseInt(selectedType),
          limit: 100,
        })

        console.log('Seat configurations response:', response)

        if (response.code === 'SUCCESS' && response.data) {
          setSeatConfigs(response.data.items)
          console.log('Seat configs loaded:', response.data.items?.length || 0)
        } else {
          console.warn('Failed to fetch seat configurations:', response.message)
          setSeatConfigs([])
          setError('No seat configurations found for this vehicle type')
        }
      } catch (err) {
        console.error('Failed to fetch seat configurations:', err)
        setError('Failed to load seat configurations')
        setSeatConfigs([])
      } finally {
        setLoading(false)
      }
    }

    fetchSeatConfigurations()
  }, [selectedType, seatApi])

  // Fetch trip seats when trip is selected
  React.useEffect(() => {
    const fetchTripSeats = async () => {
      if (!selectedTripId) {
        setTripSeats([])
        return
      }

      try {
        const response = await seatApi.getTripSeats({ tripId: parseInt(selectedTripId) })
        if (response.code === 'SUCCESS' && response.data) {
          setTripSeats(response.data)
        } else {
          console.warn('Failed to fetch trip seats:', response.message)
          setTripSeats([])
        }
      } catch (err) {
        console.error('Failed to fetch trip seats:', err)
        setTripSeats([])
      }
    }

    fetchTripSeats()
  }, [selectedTripId, seatApi])

  const selectedVehicleType = vehicleTypes.find((vt) => vt.vehicleTypeId === parseInt(selectedType))
  const selectedTrip = trips.find((trip) => trip.tripId === parseInt(selectedTripId || '0'))

  // Get booked seats from trip data
  const bookedSeats = tripSeats.filter((ts) => ts.isBooked).map((ts) => ts.seatNumber)

  const getSeatStatus = (seatNumber: string, isAvailable: boolean): SeatStatus => {
    if (selectedTripId && bookedSeats.includes(seatNumber)) return SEAT_STATUS.BOOKED
    if (!isAvailable) return SEAT_STATUS.MAINTENANCE
    return SEAT_STATUS.AVAILABLE
  }

  const getBadgeVariant = (status: SeatStatus) => {
    return SEAT_STATUS_BADGE_VARIANTS[status]
  }

  const getBadgeText = (status: SeatStatus) => {
    return SEAT_STATUS_BADGE_TEXT[status]
  }

  const getGridColumns = (vehicleTypeId: number) => {
    const layout = Object.values(VEHICLE_TYPE_LAYOUTS).find((layout) => layout.id === vehicleTypeId)
    return layout?.gridColumns || 'grid-cols-4'
  }

  const handleSeatToggle = async (seatConfigId: number, isAvailable: boolean) => {
    try {
      setLoading(true)
      const response = await seatApi.updateSeatAvailability({
        seatConfigId,
        isAvailable,
      })

      if (response.code === 'SUCCESS' && response.data) {
        // Update local state
        setSeatConfigs((prev) =>
          prev.map((seat) =>
            seat.seatConfigId === seatConfigId
              ? { ...seat, isAvailable: response.data!.isAvailable }
              : seat,
          ),
        )
        console.log('Seat availability updated successfully')
      }
    } catch (err) {
      console.error('Failed to update seat availability:', err)
      setError('Failed to update seat availability')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSeatConfigurations = async () => {
    if (!selectedVehicleType) return

    try {
      setLoading(true)
      setError(null)

      // Create seat configurations based on vehicle type capacity
      const seatConfigs = []
      const capacity = selectedVehicleType.seatCapacity
      const rows = Math.ceil(capacity / 4) // Assume 4 seats per row

      for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= 4; col++) {
          const seatNumber = (row - 1) * 4 + col
          if (seatNumber <= capacity) {
            seatConfigs.push({
              vehicleTypeId: selectedVehicleType.vehicleTypeId,
              seatNumber: `L${row}${col}`,
              rowNumber: row,
              columnNumber: col,
              isAvailable: true,
            })
          }
        }
      }

      // Create seat configurations in bulk
      const response = await fetch('/api/seat-configurations/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleTypeId: selectedVehicleType.vehicleTypeId,
          seatConfigurations: seatConfigs,
        }),
      })

      const result = await response.json()

      if (result.code === 'SUCCESS') {
        console.log('Seat configurations created successfully')
        // Refresh seat configurations
        const seatResponse = await seatApi.getSeatConfigurations({
          vehicleTypeId: selectedVehicleType.vehicleTypeId,
          limit: 100,
        })
        if (seatResponse.code === 'SUCCESS' && seatResponse.data) {
          setSeatConfigs(seatResponse.data.items)
        }
      } else {
        setError('Failed to create seat configurations: ' + result.message)
      }
    } catch (err) {
      console.error('Failed to create seat configurations:', err)
      setError('Failed to create seat configurations')
    } finally {
      setLoading(false)
    }
  }

  // Show message if no vehicle types available
  if (vehicleTypes.length === 0 && !loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No vehicle types found</p>
            <p className="text-sm text-muted-foreground mb-6">Please create vehicle types first.</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading && seatConfigs.length === 0) {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Seat Configuration</span>
          <div className="flex gap-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type.vehicleTypeId} value={type.vehicleTypeId.toString()}>
                    {type.name} ({type.seatCapacity} seats)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTripId || ''} onValueChange={setSelectedTripId}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select trip (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Select">No trip selected</SelectItem>
                {trips.map((trip) => (
                  <SelectItem key={trip.tripId} value={trip.tripId.toString()}>
                    Trip #{trip.tripId.toString().padStart(4, '0')} - {trip.vehicle?.licensePlate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Vehicle Info */}
          {selectedVehicleType && (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h3 className="text-lg font-semibold">{selectedVehicleType.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Total Capacity: {selectedVehicleType.seatCapacity} seats
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Price per seat</p>
                <p className="text-lg font-semibold">
                  {selectedVehicleType.pricePerSeat.toLocaleString('vi-VN')} VND
                </p>
              </div>
            </div>
          )}

          {/* No seat configurations message */}
          {selectedVehicleType && seatConfigs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No seat configurations found for {selectedVehicleType.name}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Click the button below to create seat configurations automatically.
              </p>
              <Button onClick={handleCreateSeatConfigurations} disabled={loading}>
                {loading ? 'Creating...' : 'Create Seat Configurations'}
              </Button>
            </div>
          )}

          {/* Trip Info */}
          {selectedTrip && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  Trip #{selectedTrip.tripId.toString().padStart(4, '0')}
                </h3>
                <p className="text-sm text-blue-700">
                  Vehicle: {selectedTrip.vehicle?.licensePlate} | Driver:{' '}
                  {selectedTrip.driver?.name} | Status: {selectedTrip.status}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-700">Booked seats</p>
                <p className="text-lg font-semibold text-blue-900">
                  {bookedSeats.length} / {selectedVehicleType?.seatCapacity || 0}
                </p>
              </div>
            </div>
          )}

          {/* Seat Map - Only show if there are seat configurations */}
          {seatConfigs.length > 0 && (
            <>
              {/* Legend */}
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Badge variant="default">Available</Badge>
                  <span className="text-sm text-muted-foreground">Green</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Booked</Badge>
                  <span className="text-sm text-muted-foreground">Red</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Maintenance</Badge>
                  <span className="text-sm text-muted-foreground">Yellow</span>
                </div>
              </div>

              {/* Seat Map */}
              <div className="space-y-4">
                <h4 className="text-md font-medium">Seat Map</h4>
                {loading && (
                  <div className="flex items-center justify-center p-4">
                    <LoadingIndicator />
                  </div>
                )}
                <div
                  className={`grid ${getGridColumns(parseInt(selectedType))} ${SEAT_CONFIG_CONSTANTS.SEAT_GRID_GAP} ${SEAT_CONFIG_CONSTANTS.MAX_WIDTH}`}
                >
                  {seatConfigs.map((seat) => {
                    const status = getSeatStatus(seat.seatNumber, seat.isAvailable)
                    const isBooked = status === SEAT_STATUS.BOOKED

                    return (
                      <Card
                        key={seat.seatConfigId}
                        className={`${SEAT_CONFIG_CONSTANTS.CARD_PADDING} ${SEAT_CONFIG_CONSTANTS.TRANSITION} ${SEAT_CONFIG_CONSTANTS.HOVER_EFFECT}`}
                      >
                        <div className="text-center space-y-2">
                          {/* Seat Number */}
                          <div className="text-sm font-medium">{seat.seatNumber}</div>

                          {/* Status Badge */}
                          <Badge variant={getBadgeVariant(status)} className="text-xs">
                            {getBadgeText(status)}
                          </Badge>

                          {/* Position Info */}
                          <div className="text-xs text-muted-foreground">
                            Row {seat.rowNumber}, Col {seat.columnNumber}
                          </div>

                          {/* Toggle Switch - Only for non-booked seats */}
                          {!isBooked && (
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-xs text-muted-foreground">Available</span>
                              <Switch
                                checked={seat.isAvailable}
                                onCheckedChange={(checked) =>
                                  handleSeatToggle(seat.seatConfigId, checked)
                                }
                                disabled={loading}
                              />
                            </div>
                          )}

                          {/* Booked indicator */}
                          {isBooked && (
                            <div className="text-xs text-destructive font-medium">
                              Cannot modify
                            </div>
                          )}
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Statistics */}
              <div
                className={`grid ${SEAT_CONFIG_CONSTANTS.STATS_GRID_COLS} ${SEAT_CONFIG_CONSTANTS.STATS_GAP} mt-6`}
              >
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {
                        seatConfigs.filter(
                          (s) =>
                            getSeatStatus(s.seatNumber, s.isAvailable) === SEAT_STATUS.AVAILABLE,
                        ).length
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Available</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {
                        seatConfigs.filter(
                          (s) => getSeatStatus(s.seatNumber, s.isAvailable) === SEAT_STATUS.BOOKED,
                        ).length
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Booked</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {
                        seatConfigs.filter(
                          (s) =>
                            getSeatStatus(s.seatNumber, s.isAvailable) === SEAT_STATUS.MAINTENANCE,
                        ).length
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Maintenance</div>
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
