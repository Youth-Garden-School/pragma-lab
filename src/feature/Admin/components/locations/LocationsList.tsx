'use client'
import React, { useState } from 'react'
import { Search, MapPin, Download, Upload, Edit, Trash2, MoreVertical } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { LocationDialog } from './LocationDialog'
import { mockLocations } from '@/feature/Admin/data/mockData'
import { toast } from 'sonner'

const vietnameseProvinces = [
  'All Provinces',
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

export const LocationsList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('All Provinces')
  const [selectedLocations, setSelectedLocations] = useState<number[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<(typeof mockLocations)[0] | null>(null)

  const filteredLocations = mockLocations.filter((location) => {
    const matchesSearch = location.detail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProvince =
      selectedProvince === 'All Provinces' || location.province === selectedProvince
    return matchesSearch && matchesProvince
  })

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

  const handleEdit = (location: (typeof mockLocations)[0]) => {
    setEditingLocation(location)
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingLocation(null)
    setIsDialogOpen(true)
  }

  const handleDelete = (locationId: number) => {
    console.log('Delete location:', locationId)
    toast.success('Location deleted successfully')
  }

  const handleBulkDelete = () => {
    console.log('Bulk delete locations:', selectedLocations)
    toast.success(`${selectedLocations.length} locations deleted successfully`)
    setSelectedLocations([])
  }

  const handleExport = () => {
    console.log('Export locations')
    toast.success('Locations exported successfully')
  }

  const handleImport = () => {
    console.log('Import locations')
    toast.success('Locations imported successfully')
  }

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
              <span className="text-sm text-muted-foreground">
                {selectedLocations.length} location(s) selected
              </span>
              <Button onClick={handleBulkDelete} variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          )}

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedLocations.length === filteredLocations.length &&
                        filteredLocations.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Location Name</TableHead>
                  <TableHead>Province</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLocations.map((location) => (
                  <TableRow key={location.locationId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedLocations.includes(location.locationId)}
                        onCheckedChange={(checked) =>
                          handleSelectLocation(location.locationId, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">{location.detail}</TableCell>
                    <TableCell>{location.province}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(location)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(location.locationId)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLocations.length === 0 && (
            <div className="text-center py-8">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No locations found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedProvince !== 'All Provinces'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding a new location.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <LocationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        location={editingLocation}
      />
    </>
  )
}
