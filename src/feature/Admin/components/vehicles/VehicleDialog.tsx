'use client'
import React from 'react'
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
import { mockVehicleTypes } from '@/feature/Admin/data/mockData'
import { toast } from 'sonner'

interface VehicleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicle?: any
}

export const VehicleDialog = ({ open, onOpenChange, vehicle }: VehicleDialogProps) => {
  const form = useForm({
    defaultValues: vehicle || {
      licensePlate: '',
      vehicleTypeId: '',
    },
  })

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

  const onSubmit = (data: any) => {
    if (vehicle) {
      console.log('Updating vehicle ID:', vehicle.vehicleId, 'with data:', data)
      toast.success('Vehicle updated successfully')
    } else {
      console.log('Creating new vehicle with data:', data)
      toast.success('Vehicle created successfully')
    }
    onOpenChange(false)
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
                      {mockVehicleTypes.map((type) => (
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
              <Button type="submit">{vehicle ? 'Update' : 'Create'} Vehicle</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
