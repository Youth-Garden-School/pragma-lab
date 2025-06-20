'use client'
import React, { useState, useEffect } from 'react'
import { Plus, MoreHorizontal } from 'lucide-react'
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
import { VehicleTypeDialog } from './VehicleTypeDialog'

export const VehicleTypesTab = () => {
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicleType, setEditingVehicleType] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchVehicleTypes = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/vehicletypes')
      const data = await res.json()
      if (data.success) {
        setVehicleTypes(data.data)
      }
    } catch (e) {
      // handle error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicleTypes()
  }, [])

  const handleAddVehicleType = () => {
    setEditingVehicleType(null)
    setIsDialogOpen(true)
  }

  const handleEditVehicleType = (vehicleType: any) => {
    setEditingVehicleType(vehicleType)
    setIsDialogOpen(true)
  }

  const handleDeleteVehicleType = async (vehicleTypeId: number) => {
    if (!window.confirm('Are you sure you want to delete this vehicle type?')) return
    try {
      const res = await fetch(`/api/vehicletypes/${vehicleTypeId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        setVehicleTypes(vehicleTypes.filter((v) => v.vehicleTypeId !== vehicleTypeId))
      } else {
        alert(data.error || 'Delete failed')
      }
    } catch (e) {
      alert('Delete failed')
    }
  }

  const handleDialogSuccess = () => {
    setIsDialogOpen(false)
    fetchVehicleTypes()
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
          {loading ? (
            <div>Loading...</div>
          ) : (
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
                {vehicleTypes.map((type) => (
                  <TableRow key={type.vehicleTypeId}>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell>{type.seatCapacity} seats</TableCell>
                    <TableCell>{type.pricePerSeat.toLocaleString('vi-VN')} VND</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
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
          )}
        </CardContent>
      </Card>

      <VehicleTypeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        vehicleType={editingVehicleType}
        onSuccess={handleDialogSuccess}
      />
    </>
  )
}
