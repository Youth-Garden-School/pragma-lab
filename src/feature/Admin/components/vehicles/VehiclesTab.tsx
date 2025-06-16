'use client'
import React, { useState } from 'react'
import { Plus, MoreVertical } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockVehicles, mockVehicleTypes } from '@/feature/Admin/data/mockData'
import { VehicleDialog } from './VehicleDialog'

export const VehiclesTab = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)

  const vehiclesData = mockVehicles.map((vehicle) => ({
    ...vehicle,
    vehicleTypeName: mockVehicleTypes.find((vt) => vt.vehicleTypeId === vehicle.vehicleTypeId)
      ?.name,
  }))

  const handleAddVehicle = () => {
    setEditingVehicle(null)
    setIsDialogOpen(true)
  }

  const handleEditVehicle = (vehicle: any) => {
    setEditingVehicle(vehicle)
    setIsDialogOpen(true)
  }

  const handleDeleteVehicle = (vehicleId: number) => {
    console.log('Delete vehicle:', vehicleId)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Vehicles</span>
            <Button onClick={handleAddVehicle} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Vehicle
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>License Plate</TableHead>
                <TableHead>Vehicle Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehiclesData.map((vehicle) => (
                <TableRow key={vehicle.vehicleId}>
                  <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                  <TableCell>{vehicle.vehicleTypeName}</TableCell>
                  <TableCell>
                    <Badge variant="default">Active</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEditVehicle(vehicle)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>Maintenance</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteVehicle(vehicle.vehicleId)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <VehicleDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} vehicle={editingVehicle} />
    </>
  )
}
