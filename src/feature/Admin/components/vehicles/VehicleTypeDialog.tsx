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
          toast.success('Vehicle type created successfully')
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
                    <Input type="number" placeholder="Enter seat capacity" {...field} />
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

            <div className="flex justify-end gap-2 pt-4">
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
