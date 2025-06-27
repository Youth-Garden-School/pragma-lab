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

// Constants for easy customization
const CONSTANTS = {
  LOCALE: 'vi-VN',
  CURRENCY: 'VND',
  CONFIRM_DELETE_MESSAGE: 'Are you sure you want to delete this vehicle type?',
  DELETE_FAILED_MESSAGE: 'Delete failed',
  LOADING_MESSAGE: 'Loading...',
  SEATS_LABEL: 'seats',
  TABLE_HEADERS: {
    TYPE_NAME: 'Type Name',
    SEAT_CAPACITY: 'Seat Capacity',
    PRICE_PER_SEAT: 'Price per Seat',
    ACTIONS: 'Actions',
  },
  BUTTON_LABELS: {
    ADD_VEHICLE_TYPE: 'Add Vehicle Type',
    EDIT: 'Edit',
    DELETE: 'Delete',
  },
} as const

// TypeScript interfaces
interface VehicleType {
  vehicleTypeId: number
  name: string
  seatCapacity: number
  pricePerSeat: string
  vehicles: Array<{
    vehicleId: number
    licensePlate: string
  }>
  seatConfigs: Array<{
    seatConfigId: number
    vehicleTypeId: number
    seatNumber: string
    rowNumber: number
    columnNumber: number
    isAvailable: boolean
  }>
  _count: {
    vehicles: number
  }
}

interface ApiResponse {
  statusCode: number
  code: string
  message: string
  data: VehicleType[]
}

export const VehicleTypesTab = () => {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicleType, setEditingVehicleType] = useState<VehicleType | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchVehicleTypes = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/vehicletypes')
      const data: ApiResponse = await res.json()
      if (data.code === 'SUCCESS') {
        setVehicleTypes(data.data)
      } else {
        console.error('API Error:', data.message)
      }
    } catch (e) {
      // handle error
      console.error('Error fetching vehicle types:', e)
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

  const handleEditVehicleType = (vehicleType: VehicleType) => {
    setEditingVehicleType(vehicleType)
    setIsDialogOpen(true)
  }

  const handleDeleteVehicleType = async (vehicleTypeId: number) => {
    if (!window.confirm(CONSTANTS.CONFIRM_DELETE_MESSAGE)) return
    try {
      const res = await fetch(`/api/vehicletypes/${vehicleTypeId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.code === 'SUCCESS') {
        setVehicleTypes(vehicleTypes.filter((v) => v.vehicleTypeId !== vehicleTypeId))
      } else {
        alert(data.message || CONSTANTS.DELETE_FAILED_MESSAGE)
      }
    } catch (e) {
      alert(CONSTANTS.DELETE_FAILED_MESSAGE)
    }
  }

  const handleDialogSuccess = () => {
    setIsDialogOpen(false)
    fetchVehicleTypes()
  }

  const formatPrice = (pricePerSeat: string): string => {
    const numericPrice = parseFloat(pricePerSeat)
    return `${numericPrice.toLocaleString(CONSTANTS.LOCALE)} ${CONSTANTS.CURRENCY}`
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Vehicle Types</span>
            <Button onClick={handleAddVehicleType} className="gap-2">
              <Plus className="h-4 w-4" />
              {CONSTANTS.BUTTON_LABELS.ADD_VEHICLE_TYPE}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>{CONSTANTS.LOADING_MESSAGE}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{CONSTANTS.TABLE_HEADERS.TYPE_NAME}</TableHead>
                  <TableHead>{CONSTANTS.TABLE_HEADERS.SEAT_CAPACITY}</TableHead>
                  <TableHead>{CONSTANTS.TABLE_HEADERS.PRICE_PER_SEAT}</TableHead>
                  <TableHead>{CONSTANTS.TABLE_HEADERS.ACTIONS}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicleTypes.map((type) => (
                  <TableRow key={type.vehicleTypeId}>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell>
                      {type.seatCapacity} {CONSTANTS.SEATS_LABEL}
                    </TableCell>
                    <TableCell>{formatPrice(type.pricePerSeat)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEditVehicleType(type)}>
                            {CONSTANTS.BUTTON_LABELS.EDIT}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteVehicleType(type.vehicleTypeId)}
                          >
                            {CONSTANTS.BUTTON_LABELS.DELETE}
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
        vehicleTypes={vehicleTypes}
      />
    </>
  )
}
