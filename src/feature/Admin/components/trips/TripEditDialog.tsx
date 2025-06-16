'use client'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import {
  mockVehicles,
  mockUsers,
  mockVehicleTypes,
  mockLocations,
  mockTripStops,
  TripStatus,
} from '@/feature/Admin/data/mockData'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { format } from 'date-fns'
import { Label } from '@/components/ui/label'

interface TripEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trip?: any
}

interface TripStop {
  id: string
  tripStopId?: number
  locationId: number
  stopOrder: number
  arrivalTime: Date | undefined
  departureTime: Date | undefined
  isPickup: boolean
}

export const TripEditDialog = ({ open, onOpenChange, trip }: TripEditDialogProps) => {
  const [tripStops, setTripStops] = useState<TripStop[]>([])

  const form = useForm({
    defaultValues: {
      vehicleId: '',
      driverId: '',
      status: TripStatus.upcoming,
      note: '',
    },
  })

  useEffect(() => {
    if (trip) {
      // Populate vehicle relations
      const vehicle = mockVehicles.find((v) => v.vehicleId === trip.vehicleId)
      if (vehicle) {
        vehicle.vehicleType = mockVehicleTypes.find(
          (vt) => vt.vehicleTypeId === vehicle.vehicleTypeId,
        )
        trip.vehicle = vehicle
      }

      // Populate driver relations
      const driver = mockUsers.find((u) => u.userId === trip.driverId)
      if (driver) {
        trip.driver = driver
      }

      // Populate trip stops
      const stops = mockTripStops
        .filter((ts) => ts.tripId === trip.tripId)
        .map((stop) => ({
          id: Date.now().toString() + stop.tripStopId,
          tripStopId: stop.tripStopId,
          locationId: stop.locationId,
          stopOrder: stop.stopOrder,
          arrivalTime: new Date(stop.arrivalTime),
          departureTime: new Date(stop.departureTime),
          isPickup: stop.isPickup,
        }))
        .sort((a, b) => a.stopOrder - b.stopOrder)

      setTripStops(stops)

      form.reset({
        vehicleId: trip.vehicleId?.toString() || '',
        driverId: trip.driverId?.toString() || '',
        status: trip.status || TripStatus.upcoming,
        note: trip.note || '',
      })
    }
  }, [trip, form])

  const availableDrivers = mockUsers.filter((user) => user.role === 'employee')

  // Populate vehicle types for display
  const vehiclesWithTypes = mockVehicles.map((vehicle) => ({
    ...vehicle,
    vehicleType: mockVehicleTypes.find((vt) => vt.vehicleTypeId === vehicle.vehicleTypeId),
  }))

  const handleAddStop = () => {
    const newStop: TripStop = {
      id: Date.now().toString(),
      locationId: 0,
      stopOrder: tripStops.length + 1,
      arrivalTime: undefined,
      departureTime: undefined,
      isPickup: tripStops.length === 0, // First stop is pickup by default
    }
    setTripStops([...tripStops, newStop])
  }

  const handleRemoveStop = (stopId: string) => {
    setTripStops(tripStops.filter((stop) => stop.id !== stopId))
  }

  const handleStopChange = (stopId: string, field: keyof TripStop, value: any) => {
    setTripStops(tripStops.map((stop) => (stop.id === stopId ? { ...stop, [field]: value } : stop)))
  }

  const onSubmit = (data: any) => {
    console.log('Trip update data:', {
      ...data,
      vehicleId: parseInt(data.vehicleId),
      driverId: parseInt(data.driverId),
      tripStops: tripStops.map((stop) => ({
        ...stop,
        locationId: parseInt(stop.locationId.toString()),
        tripId: trip?.tripId,
      })),
    })

    if (trip) {
      toast.success(`Trip #${trip.tripId?.toString().padStart(4, '0')} updated successfully`)
    } else {
      toast.success('Trip created successfully')
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {trip ? `Edit Trip #${trip.tripId?.toString().padStart(4, '0')}` : 'Create New Trip'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vehicleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehiclesWithTypes.map((vehicle) => (
                          <SelectItem key={vehicle.vehicleId} value={vehicle.vehicleId.toString()}>
                            {vehicle.licensePlate} - {vehicle.vehicleType?.name || 'Unknown Type'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="driverId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableDrivers.map((driver) => (
                          <SelectItem key={driver.userId} value={driver.userId.toString()}>
                            {driver.name} - {driver.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={TripStatus.upcoming}>Upcoming</SelectItem>
                        <SelectItem value={TripStatus.ongoing}>Ongoing</SelectItem>
                        <SelectItem value={TripStatus.completed}>Completed</SelectItem>
                        <SelectItem value={TripStatus.cancelled}>Cancelled</SelectItem>
                        <SelectItem value={TripStatus.delayed}>Delayed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter trip notes..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Trip Stops Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Trip Stops</h3>
                <Button onClick={handleAddStop} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stop
                </Button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {tripStops.map((stop, index) => (
                  <Card key={stop.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <CardTitle className="text-sm">Stop {index + 1}</CardTitle>
                          <Badge variant={stop.isPickup ? 'default' : 'secondary'}>
                            {stop.isPickup ? 'Pickup' : 'Drop-off'}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveStop(stop.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Select
                            value={stop.locationId.toString()}
                            onValueChange={(value) =>
                              handleStopChange(stop.id, 'locationId', parseInt(value))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockLocations.map((location) => (
                                <SelectItem
                                  key={location.locationId}
                                  value={location.locationId.toString()}
                                >
                                  <div className="flex flex-col">
                                    <span>{location.detail}</span>
                                    <span className="text-sm text-gray-500">
                                      {location.province}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Stop Type</Label>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`pickup-${stop.id}`}
                              checked={stop.isPickup}
                              onCheckedChange={(checked) =>
                                handleStopChange(stop.id, 'isPickup', checked)
                              }
                            />
                            <Label htmlFor={`pickup-${stop.id}`}>Pickup Location</Label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Arrival Time</Label>
                          <Input
                            type="time"
                            value={stop.arrivalTime ? format(stop.arrivalTime, 'HH:mm') : ''}
                            onChange={(e) => {
                              if (e.target.value) {
                                const [hours, minutes] = e.target.value.split(':')
                                const date = new Date()
                                date.setHours(parseInt(hours), parseInt(minutes))
                                handleStopChange(stop.id, 'arrivalTime', date)
                              }
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Departure Time</Label>
                          <Input
                            type="time"
                            value={stop.departureTime ? format(stop.departureTime, 'HH:mm') : ''}
                            onChange={(e) => {
                              if (e.target.value) {
                                const [hours, minutes] = e.target.value.split(':')
                                const date = new Date()
                                date.setHours(parseInt(hours), parseInt(minutes))
                                handleStopChange(stop.id, 'departureTime', date)
                              }
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {tripStops.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No stops added yet. Click "Add Stop" to create your first stop.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{trip ? 'Update Trip' : 'Create Trip'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
