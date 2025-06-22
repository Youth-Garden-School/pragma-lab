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
import {
  SEAT_STATUS,
  SEAT_STATUS_BADGE_VARIANTS,
  SEAT_STATUS_BADGE_TEXT,
  VEHICLE_TYPE_LAYOUTS,
  type SeatStatus,
} from '@/shared/constants/seatConstants'
import { LoadingIndicator } from '@/components/Common/LoadingIndicator'

export const SeatConfigurationTab = () => {
  const [selectedType, setSelectedType] = React.useState<string>('1')
  const [seatConfigs, setSeatConfigs] = React.useState<SeatConfiguration[]>([])
  const [vehicleTypes, setVehicleTypes] = React.useState<VehicleType[]>([])
  const [tripSeats, setTripSeats] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const seatApi = React.useMemo(() => new SeatApi(), [])

  // Fetch vehicle types on component mount
  React.useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        setLoading(true)
        const response = await seatApi.getVehicleTypes()
        if (response.code === 'SUCCESS' && response.data) {
          setVehicleTypes(response.data)
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

  // Fetch seat configurations when vehicle type changes
  React.useEffect(() => {
    const fetchSeatConfigurations = async () => {
      if (!selectedType) return

      try {
        setLoading(true)
        setError(null)

        const response = await seatApi.getSeatConfigurations({
          vehicleTypeId: parseInt(selectedType),
          limit: 100,
        })

        if (response.code === 'SUCCESS' && response.data) {
          setSeatConfigs(response.data.items)
        }
      } catch (err) {
        console.error('Failed to fetch seat configurations:', err)
        setError('Failed to load seat configurations')
      } finally {
        setLoading(false)
      }
    }

    fetchSeatConfigurations()
  }, [selectedType, seatApi])

  // Fetch trip seats for demo purposes (using trip 1 as example)
  React.useEffect(() => {
    const fetchTripSeats = async () => {
      try {
        const response = await seatApi.getTripSeats({ tripId: 1 })
        if (response.code === 'SUCCESS' && response.data) {
          setTripSeats(response.data)
        }
      } catch (err) {
        console.error('Failed to fetch trip seats:', err)
        // Don't set error for trip seats as it's optional
      }
    }

    fetchTripSeats()
  }, [seatApi])

  const selectedVehicleType = vehicleTypes.find((vt) => vt.vehicleTypeId === parseInt(selectedType))

  // Get booked seats from trip data for demo purposes (using trip 1 as example)
  const bookedSeats = tripSeats
    .filter((ts) => ts.tripId === 1 && ts.isBooked)
    .map((ts) => ts.seatNumber)

  const getSeatStatus = (seatNumber: string, isAvailable: boolean): SeatStatus => {
    if (bookedSeats.includes(seatNumber)) return SEAT_STATUS.BOOKED
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
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
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
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent>
              {vehicleTypes.map((type) => (
                <SelectItem key={type.vehicleTypeId} value={type.vehicleTypeId.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            <div className={`grid ${getGridColumns(parseInt(selectedType))} gap-3 max-w-4xl`}>
              {seatConfigs.map((seat) => {
                const status = getSeatStatus(seat.seatNumber, seat.isAvailable)
                const isBooked = status === SEAT_STATUS.BOOKED

                return (
                  <Card key={seat.seatConfigId} className="p-3 transition-all hover:shadow-md">
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
                        <div className="text-xs text-destructive font-medium">Cannot modify</div>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {
                    seatConfigs.filter(
                      (s) => getSeatStatus(s.seatNumber, s.isAvailable) === SEAT_STATUS.AVAILABLE,
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
                      (s) => getSeatStatus(s.seatNumber, s.isAvailable) === SEAT_STATUS.MAINTENANCE,
                    ).length
                  }
                </div>
                <div className="text-sm text-muted-foreground">Maintenance</div>
              </div>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
