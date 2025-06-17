'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { mockLocations } from '@/feature/Admin/data/mockData'

const vietnameseProvinces = [
  'Hà Nội',
  'TP.HCM',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Khánh Hòa',
  'Thừa Thiên Huế',
  'An Giang',
  'Bà Rịa - Vũng Tàu',
]

const locationFormSchema = z.object({
  detail: z
    .string()
    .min(1, 'Location name is required')
    .min(3, 'Location name must be at least 3 characters'),
  province: z.string().min(1, 'Province is required'),
})

type LocationFormValues = z.infer<typeof locationFormSchema>

interface LocationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  location?: (typeof mockLocations)[0] | null
}

export const LocationDialog = ({ open, onOpenChange, location }: LocationDialogProps) => {
  const isEditing = !!location

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      detail: location?.detail || '',
      province: location?.province || '',
    },
  })

  React.useEffect(() => {
    if (location) {
      form.reset({
        detail: location.detail,
        province: location.province,
      })
    } else {
      form.reset({
        detail: '',
        province: '',
      })
    }
  }, [location, form])

  const onSubmit = (data: LocationFormValues) => {
    console.log('Form data:', data)

    if (isEditing) {
      console.log('Updating location:', location.locationId, data)
      toast.success(`${data.detail} has been updated successfully.`)
    } else {
      console.log('Creating new location:', data)
      toast.success(`${data.detail} has been created successfully.`)
    }

    onOpenChange(false)
    form.reset()
  }

  const handleCancel = () => {
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Location' : 'Add New Location'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the location information below.'
              : 'Fill in the information to create a new location.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="detail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location name (e.g., Bến xe Mỹ Đình)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a province" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vietnameseProvinces.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? 'Update Location' : 'Create Location'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
