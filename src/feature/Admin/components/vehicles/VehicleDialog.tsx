'use client'
import React, { useState } from 'react'
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

interface VehicleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicle?: any
  vehicleTypes?: any[]
  onSuccess?: () => void
}

export const VehicleDialog = ({
  open,
  onOpenChange,
  vehicle,
  vehicleTypes = [],
  onSuccess,
}: VehicleDialogProps) => {
  const form = useForm({
    defaultValues: vehicle || {
      licensePlate: '',
      vehicleTypeId: '',
    },
  })

  const [loading, setLoading] = useState(false)

  React.useEffect(() => {
    if (vehicle) {
      form.reset({
        licensePlate: vehicle.licensePlate,
        vehicleTypeId: vehicle.vehicleTypeId.toString(),
      })
    } else {
      form.reset({
        licensePlate: '',
        vehicleTypeId: '',
      })
    }
  }, [vehicle, form])

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      let response, result
      if (vehicle) {
        // Update vehicle
        response = await fetch(`/api/vehicles/${vehicle.vehicleId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            licensePlate: data.licensePlate,
            vehicleTypeId: data.vehicleTypeId,
          }),
        })
        result = await response.json()
        if (response.ok && result.success) {
          toast.success(result.message || 'Vehicle updated successfully')
          onOpenChange(false)
          onSuccess && onSuccess()
        } else {
          toast.error(result.error || 'Failed to update vehicle')
        }
      } else {
        // Create vehicle
        response = await fetch('/api/vehicles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            licensePlate: data.licensePlate,
            vehicleTypeId: data.vehicleTypeId,
          }),
        })
        result = await response.json()
        if (response.ok && result.success) {
          toast.success(result.message || 'Vehicle created successfully')
          onOpenChange(false)
          onSuccess && onSuccess()
        } else {
          toast.error(result.error || 'Failed to create vehicle')
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="licensePlate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Plate</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter license plate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicleTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(vehicleTypes || []).map((type) => (
                        <SelectItem key={type.vehicleTypeId} value={type.vehicleTypeId.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {vehicle ? 'Update' : 'Create'} Vehicle
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
