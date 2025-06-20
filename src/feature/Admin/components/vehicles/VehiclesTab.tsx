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
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { VehicleDialog } from './VehicleDialog'

export const VehiclesTab = () => {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchVehicles = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/vehicles')
      const data = await res.json()
      if (data.success) {
        setVehicles(data.data)
      }
    } catch (e) {}
    setLoading(false)
  }

  const fetchVehicleTypes = async () => {
    try {
      const res = await fetch('/api/vehicletypes')
      const data = await res.json()
      if (data.success) {
        setVehicleTypes(data.data)
      }
    } catch (e) {}
  }

  useEffect(() => {
    fetchVehicles()
    fetchVehicleTypes()
  }, [])

  const handleAddVehicle = () => {
    setEditingVehicle(null)
    setIsDialogOpen(true)
  }

  const handleEditVehicle = (vehicle: any) => {
    setEditingVehicle(vehicle)
    setIsDialogOpen(true)
  }

  const handleDeleteVehicle = async (vehicleId: number) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return
    try {
      const res = await fetch(`/api/vehicles/${vehicleId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setVehicles(vehicles.filter((v) => v.vehicleId !== vehicleId))
      } else {
        alert(data.error || 'Delete failed')
      }
    } catch (e) {
      alert('Delete failed')
    }
  }

  const handleDialogSuccess = () => {
    setIsDialogOpen(false)
    fetchVehicles()
  }

  const vehiclesData = vehicles.map((vehicle) => ({
    ...vehicle,
    vehicleTypeName:
      vehicle.vehicleType?.name ||
      vehicleTypes.find((vt) => vt.vehicleTypeId === vehicle.vehicleTypeId)?.name,
  }))

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
          {loading ? (
            <div>Loading...</div>
          ) : (
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
                            <MoreHorizontal className="h-4 w-4" />
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
          )}
        </CardContent>
      </Card>

      <VehicleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        vehicle={editingVehicle}
        vehicleTypes={vehicleTypes}
        onSuccess={handleDialogSuccess}
      />
    </>
  )
}
