"use client"
import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

const vietnameseProvinces = [
  "Hà Nội",
  "TP.HCM",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "Khánh Hòa",
  "Thừa Thiên Huế",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
]

const locationFormSchema = z.object({
  detail: z.string().min(1, "Location name is required").min(3, "Location name must be at least 3 characters"),
  province: z.string().min(1, "Province is required"),
})

type LocationFormValues = z.infer<typeof locationFormSchema>

interface LocationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  location?: {
    locationId: number
    detail: string
    province: string
  } | null
  onSuccess?: (location: any, type: "create" | "update" | "delete") => void
}

export const LocationDialog = ({ open, onOpenChange, location, onSuccess }: LocationDialogProps) => {
  const isEditing = !!location
  const [showUpdateConfirm, setShowUpdateConfirm] = React.useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)
  const [pendingFormData, setPendingFormData] = React.useState<LocationFormValues | null>(null)

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      detail: location?.detail || "",
      province: location?.province || "",
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
        detail: "",
        province: "",
      })
    }
  }, [location, form])

  const [loading, setLoading] = React.useState(false)

  const onSubmit = async (data: LocationFormValues) => {
    if (isEditing) {
      // Hiển thị xác nhận khi chỉnh sửa
      setPendingFormData(data)
      setShowUpdateConfirm(true)
    } else {
      // Tạo mới không cần xác nhận
      await handleSubmit(data)
    }
  }

  const handleSubmit = async (data: LocationFormValues) => {
    setLoading(true)
    try {
      let res
      if (isEditing && location?.locationId) {
        // Update location
        res = await fetch(`/api/locations/${location.locationId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      } else {
        // Create new location
        res = await fetch("/api/locations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      }
      const result = await res.json()
      if (res.ok && result.success) {
        toast.success(`${data.detail} has been ${isEditing ? "updated" : "created"} successfully.`)
        onOpenChange(false)
        form.reset()
        if (onSuccess) onSuccess(result.data, isEditing ? "update" : "create")
      } else {
        toast.error(result.error || "Something went wrong!")
      }
    } catch (err) {
      toast.error("Network error!")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!location?.locationId) return

    setLoading(true)
    try {
      const res = await fetch(`/api/locations/${location.locationId}`, {
        method: "DELETE",
      })
      const result = await res.json()
      if (res.ok && result.success) {
        toast.success(`${location.detail} has been deleted successfully.`)
        onOpenChange(false)
        form.reset()
        if (onSuccess) onSuccess(result.data, "delete")
      } else {
        toast.error(result.error || "Failed to delete location!")
      }
    } catch (err) {
      toast.error("Network error!")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    form.reset()
  }

  const confirmUpdate = async () => {
    if (pendingFormData) {
      await handleSubmit(pendingFormData)
      setPendingFormData(null)
    }
    setShowUpdateConfirm(false)
  }

  const confirmDelete = async () => {
    await handleDelete()
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Location" : "Add New Location"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the location information below."
                : "Fill in the information to create a new location."}
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
                    <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
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

              <DialogFooter className="gap-2">
                {isEditing && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={loading}
                    className="mr-auto"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
                <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading
                    ? isEditing
                      ? "Updating..."
                      : "Creating..."
                    : isEditing
                      ? "Update Location"
                      : "Create Location"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog for Update Confirmation */}
      <AlertDialog open={showUpdateConfirm} onOpenChange={setShowUpdateConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update this location? This action will modify the existing location information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowUpdateConfirm(false)
                setPendingFormData(null)
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmUpdate} disabled={loading}>
              {loading ? "Updating..." : "Update Location"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog for Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{location?.detail}"? This action cannot be undone and will permanently
              remove this location from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Deleting..." : "Delete Location"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default LocationDialog
