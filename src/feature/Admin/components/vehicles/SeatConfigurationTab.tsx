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
import {
  mockSeatConfigurations,
  mockVehicleTypes,
  mockTripSeats,
} from '@/feature/Admin/data/mockData'

export const SeatConfigurationTab = () => {
  const [selectedType, setSelectedType] = React.useState<string>('1')

  // Group seat configurations by vehicle type
  const seatConfigsByType = mockSeatConfigurations.reduce(
    (acc, seat) => {
      if (!acc[seat.vehicleTypeId]) acc[seat.vehicleTypeId] = []
      acc[seat.vehicleTypeId].push(seat)
      return acc
    },
    {} as Record<number, typeof mockSeatConfigurations>,
  )

  const selectedConfigs = seatConfigsByType[parseInt(selectedType)] || []
  const selectedVehicleType = mockVehicleTypes.find(
    (vt) => vt.vehicleTypeId === parseInt(selectedType),
  )

  // Get booked seats from trip data for demo purposes (using trip 1 as example)
  const bookedSeats = mockTripSeats
    .filter((ts) => ts.tripId === 1 && ts.isBooked)
    .map((ts) => ts.seatNumber)

  const getSeatStatus = (seatNumber: string, isAvailable: boolean) => {
    if (bookedSeats.includes(seatNumber)) return 'booked'
    if (!isAvailable) return 'maintenance'
    return 'available'
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'default' // Green
      case 'booked':
        return 'destructive' // Red
      case 'maintenance':
        return 'secondary' // Yellow-ish
      default:
        return 'default'
    }
  }

  const getBadgeText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available'
      case 'booked':
        return 'Booked'
      case 'maintenance':
        return 'Maintenance'
      default:
        return 'Unknown'
    }
  }

  const getGridColumns = (vehicleTypeId: number) => {
    // Different layouts for different vehicle types
    switch (vehicleTypeId) {
      case 1: // Limousine 22 chỗ - 3 columns
        return 'grid-cols-3'
      case 2: // Giường nằm 40 chỗ - 2 columns
        return 'grid-cols-2'
      case 3: // Ghế ngồi 45 chỗ - 5 columns
        return 'grid-cols-5'
      default:
        return 'grid-cols-4'
    }
  }

  const handleSeatToggle = (seatConfigId: number, isAvailable: boolean) => {
    console.log('Toggle seat configuration ID:', seatConfigId, 'to available:', isAvailable)
    // Here you would implement the actual toggle logic
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
              {mockVehicleTypes.map((type) => (
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
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h3 className="text-lg font-semibold">{selectedVehicleType?.name}</h3>
              <p className="text-sm text-muted-foreground">
                Total Capacity: {selectedVehicleType?.seatCapacity} seats
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Price per seat</p>
              <p className="text-lg font-semibold">
                {selectedVehicleType?.pricePerSeat.toLocaleString('vi-VN')} VND
              </p>
            </div>
          </div>

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
            <div className={`grid ${getGridColumns(parseInt(selectedType))} gap-3 max-w-4xl`}>
              {selectedConfigs.map((seat) => {
                const status = getSeatStatus(seat.seatNumber, seat.isAvailable)
                const isBooked = status === 'booked'

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
                    selectedConfigs.filter(
                      (s) => getSeatStatus(s.seatNumber, s.isAvailable) === 'available',
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
                    selectedConfigs.filter(
                      (s) => getSeatStatus(s.seatNumber, s.isAvailable) === 'booked',
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
                    selectedConfigs.filter(
                      (s) => getSeatStatus(s.seatNumber, s.isAvailable) === 'maintenance',
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
