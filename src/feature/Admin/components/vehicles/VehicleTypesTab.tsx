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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockVehicleTypes } from '@/feature/Admin/data/mockData'
import { VehicleTypeDialog } from './VehicleTypeDialog'

export const VehicleTypesTab = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicleType, setEditingVehicleType] = useState(null)

  const handleAddVehicleType = () => {
    setEditingVehicleType(null)
    setIsDialogOpen(true)
  }

  const handleEditVehicleType = (vehicleType: any) => {
    setEditingVehicleType(vehicleType)
    setIsDialogOpen(true)
  }

  const handleDeleteVehicleType = (vehicleTypeId: number) => {
    console.log('Delete vehicle type:', vehicleTypeId)
    // Here you would implement the actual delete logic
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Vehicle Types</span>
            <Button onClick={handleAddVehicleType} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Vehicle Type
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type Name</TableHead>
                <TableHead>Seat Capacity</TableHead>
                <TableHead>Price per Seat</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVehicleTypes.map((type) => (
                <TableRow key={type.vehicleTypeId}>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell>{type.seatCapacity} seats</TableCell>
                  <TableCell>{type.pricePerSeat.toLocaleString('vi-VN')} VND</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEditVehicleType(type)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteVehicleType(type.vehicleTypeId)}
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

      <VehicleTypeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        vehicleType={editingVehicleType}
      />
    </>
  )
}
