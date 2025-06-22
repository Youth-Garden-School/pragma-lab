'use client'
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { 
  SEAT_LAYOUT_TEMPLATES, 
  SEAT_CONFIG_DEFAULTS, 
  SEAT_VALIDATION_RULES,
  SUCCESS_MESSAGES,
  SEAT_API_ERRORS
} from '@/shared/constants/seatConstants'

interface VehicleTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicleType?: any
  onSuccess?: () => void
}

export const VehicleTypeDialog = ({
  open,
  onOpenChange,
  vehicleType,
  onSuccess,
}: VehicleTypeDialogProps) => {
  const form = useForm({
    defaultValues: vehicleType || {
      name: '',
      seatCapacity: '',
      pricePerSeat: '',
    },
  })

  React.useEffect(() => {
    if (vehicleType) {
      form.reset({
        name: vehicleType.name,
        seatCapacity: vehicleType.seatCapacity.toString(),
        pricePerSeat: vehicleType.pricePerSeat.toString(),
      })
    } else {
      form.reset({
        name: '',
        seatCapacity: '',
        pricePerSeat: '',
      })
    }
  }, [vehicleType, form])

  const onSubmit = async (data: any) => {
    const formattedData = {
      ...data,
      seatCapacity: parseInt(data.seatCapacity),
      pricePerSeat: parseInt(data.pricePerSeat),
    }

    // Validate seat capacity
    if (formattedData.seatCapacity < SEAT_VALIDATION_RULES.CAPACITY_MIN || 
        formattedData.seatCapacity > SEAT_VALIDATION_RULES.CAPACITY_MAX) {
      toast.error(SEAT_API_ERRORS.INVALID_CAPACITY)
      return
    }

    try {
      if (vehicleType) {
        // Update
        const res = await fetch(`/api/vehicletypes/${vehicleType.vehicleTypeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedData),
        })
        const result = await res.json()
        if (result.success) {
          toast.success('Vehicle type updated successfully')
          onOpenChange(false)
          onSuccess && onSuccess()
        } else {
          toast.error(result.error || 'Update failed')
        }
      } else {
        // Create
        const res = await fetch('/api/vehicletypes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedData),
        })
        const result = await res.json()
        if (result.success) {
          // Auto-create seat configurations for new vehicle type
          await createSeatConfigurations(result.data.vehicleTypeId, formattedData.seatCapacity)
          toast.success(SUCCESS_MESSAGES.VEHICLE_TYPE_CREATED)
          onOpenChange(false)
          onSuccess && onSuccess()
        } else {
          toast.error(result.error || 'Create failed')
        }
      }
    } catch (e) {
      toast.error('Request failed')
    }
  }

  // Auto-generate seat configurations based on capacity
  const createSeatConfigurations = async (vehicleTypeId: number, seatCapacity: number) => {
    try {
      const seatConfigurations = generateSeatLayout(seatCapacity)
      
      const res = await fetch('/api/seat-configurations/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleTypeId,
          seatConfigurations
        }),
      })
      
      const result = await res.json()
      if (!result.success) {
        console.warn('Failed to auto-create seat configurations:', result.error)
        toast.warning('Vehicle type created but seat configuration failed')
      }
    } catch (error) {
      console.warn('Failed to auto-create seat configurations:', error)
      toast.warning('Vehicle type created but seat configuration failed')
    }
  }

  // Generate seat layout based on capacity using templates
  const generateSeatLayout = (capacity: number) => {
    try {
      // Determine template based on capacity
      let template: typeof SEAT_LAYOUT_TEMPLATES[keyof typeof SEAT_LAYOUT_TEMPLATES] = SEAT_LAYOUT_TEMPLATES.STANDARD_BUS
      
      if (capacity <= 25) {
        template = SEAT_LAYOUT_TEMPLATES.LIMOUSINE
      } else if (capacity <= 35) {
        template = SEAT_LAYOUT_TEMPLATES.SLEEPER
      } else if (capacity > 45) {
        template = SEAT_LAYOUT_TEMPLATES.LARGE_BUS
      }

      const seats = []
      const columns = template.columns
      const rows = Math.ceil(capacity / columns)
      
      for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= columns; col++) {
          if (seats.length < capacity) {
            seats.push({
              seatNumber: template.seatNumberFormat(row, col),
              rowNumber: row,
              columnNumber: col,
              isAvailable: SEAT_CONFIG_DEFAULTS.DEFAULT_AVAILABILITY
            })
          }
        }
      }
      
      return seats
    } catch (error) {
      console.error('Failed to generate seat layout:', error)
      throw new Error(SEAT_API_ERRORS.LAYOUT_GENERATION_FAILED)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{vehicleType ? 'Edit Vehicle Type' : 'Add New Vehicle Type'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vehicle type name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seatCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seat Capacity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter seat capacity" 
                      min={SEAT_VALIDATION_RULES.CAPACITY_MIN}
                      max={SEAT_VALIDATION_RULES.CAPACITY_MAX}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricePerSeat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per Seat (VND)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter price per seat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{vehicleType ? 'Update' : 'Create'} Vehicle Type</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default VehicleTypeDialog
