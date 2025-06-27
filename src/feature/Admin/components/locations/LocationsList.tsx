"use client"
import React, { useState } from "react"
import { Search, MapPin, Download, Upload, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Checkbox } from "@/components/ui/checkbox"
import { LocationDialog } from "./LocationDialog"
import { toast } from "sonner"

const vietnameseProvinces = [
  "All Provinces",
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

export const LocationsList = () => {
  const [locations, setLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProvince, setSelectedProvince] = useState("All Provinces")
  const [selectedLocations, setSelectedLocations] = useState<number[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<any | null>(null)

  // State cho bulk delete confirmation
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false)
  const [bulkDeleting, setBulkDeleting] = useState(false)

  // Fetch locations from API
  const fetchLocations = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (selectedProvince && selectedProvince !== "All Provinces") params.append("province", selectedProvince)
      params.append("limit", "100")

      const res = await fetch(`/api/locations?${params.toString()}`)
      const result = await res.json()
      if (res.ok && result.success) {
        setLocations(result.data || [])
      } else {
        toast.error(result.error || "Failed to fetch locations")
      }
    } catch {
      toast.error("Network error!")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchLocations()
    // eslint-disable-next-line
  }, [searchTerm, selectedProvince])

  const filteredLocations = locations

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLocations(filteredLocations.map((location) => location.locationId))
    } else {
      setSelectedLocations([])
    }
  }

  const handleSelectLocation = (locationId: number, checked: boolean) => {
    if (checked) {
      setSelectedLocations([...selectedLocations, locationId])
    } else {
      setSelectedLocations(selectedLocations.filter((id) => id !== locationId))
    }
  }

  const handleEdit = (location: any) => {
    setEditingLocation(location)
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingLocation(null)
    setIsDialogOpen(true)
  }

  // Xóa đơn lẻ - sử dụng LocationDialog
  const handleDelete = (location: any) => {
    setEditingLocation(location)
    setIsDialogOpen(true)
  }

  // Bulk delete với Alert Dialog riêng
  const handleBulkDelete = () => {
    setShowBulkDeleteConfirm(true)
  }

  const confirmBulkDelete = async () => {
    setBulkDeleting(true)
    let successCount = 0
    let failCount = 0

    for (const id of selectedLocations) {
      try {
        const res = await fetch(`/api/locations/${id}`, { method: "DELETE" })
        const result = await res.json()
        if (res.ok && result.success) {
          successCount++
        } else {
          failCount++
        }
      } catch {
        failCount++
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} location(s) deleted successfully`)
      // Refresh danh sách
      await fetchLocations()
      setSelectedLocations([])
    }

    if (failCount > 0) {
      toast.error(`Failed to delete ${failCount} location(s)`)
    }

    setBulkDeleting(false)
    setShowBulkDeleteConfirm(false)
  }

  const handleExport = () => {
    toast.info("Export feature not implemented")
  }

  const handleImport = () => {
    toast.info("Import feature not implemented")
  }

  // Callback khi LocationDialog thành công
  const handleDialogSuccess = (locationData: any, type: "create" | "update" | "delete") => {
    if (type === "create") {
      setLocations((prev) => [locationData, ...prev])
    } else if (type === "update") {
      setLocations((prev) => prev.map((l) => (l.locationId === locationData.locationId ? locationData : l)))
    } else if (type === "delete") {
      // Sử dụng locationId để xóa khỏi danh sách
      const locationId = locationData.locationId
      setLocations((prev) => prev.filter((l) => l.locationId !== locationId))
      setSelectedLocations((prev) => prev.filter((id) => id !== locationId))
    }
  }

  const selectedLocationNames = selectedLocations
    .map((id) => locations.find((loc) => loc.locationId === id)?.detail)
    .filter(Boolean)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by province" />
              </SelectTrigger>
              <SelectContent>
                {vietnameseProvinces.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex space-x-2">
              <Button onClick={handleExport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleImport} variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button onClick={handleAddNew}>
                <MapPin className="h-4 w-4 mr-2" />
                Add New Location
              </Button>
            </div>
          </div>

          {selectedLocations.length > 0 && (
            <div className="flex items-center justify-between bg-muted p-4 rounded-lg mb-4">
              <span className="text-sm text-muted-foreground">{selectedLocations.length} location(s) selected</span>
              <Button onClick={handleBulkDelete} variant="destructive" size="sm" disabled={bulkDeleting}>
                <Trash2 className="h-4 w-4 mr-2" />
                {bulkDeleting ? "Deleting..." : "Delete Selected"}
              </Button>
            </div>
          )}

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedLocations.length === filteredLocations.length && filteredLocations.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Location Name</TableHead>
                  <TableHead>Province</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Loading locations...
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLocations.map((location) => (
                    <TableRow key={location.locationId}>
                      <TableCell>
                        <Checkbox
                          checked={selectedLocations.includes(location.locationId)}
                          onCheckedChange={(checked) => handleSelectLocation(location.locationId, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{location.detail}</TableCell>
                      <TableCell>{location.province}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(location)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(location)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredLocations.length === 0 && !loading && (
            <div className="text-center py-8">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No locations found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedProvince !== "All Provinces"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding a new location."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* LocationDialog cho Create/Edit/Delete đơn lẻ */}
      <LocationDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditingLocation(null)
        }}
        location={editingLocation}
        onSuccess={handleDialogSuccess}
      />

      {/* Alert Dialog cho Bulk Delete */}
      <AlertDialog open={showBulkDeleteConfirm} onOpenChange={setShowBulkDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bulk Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedLocations.length} selected location(s)?
              {selectedLocationNames.length > 0 && (
                <div className="mt-2">
                  <strong>Locations to be deleted:</strong>
                  <ul className="mt-1 text-sm list-disc list-inside">
                    {selectedLocationNames.slice(0, 5).map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                    {selectedLocationNames.length > 5 && <li>... and {selectedLocationNames.length - 5} more</li>}
                  </ul>
                </div>
              )}
              <p className="mt-2 text-destructive">
                This action cannot be undone and will permanently remove these locations from the system.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              disabled={bulkDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {bulkDeleting ? "Deleting..." : `Delete ${selectedLocations.length} Location(s)`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default LocationsList
