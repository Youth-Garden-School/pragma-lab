'use client'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Plus, Trash2, GripVertical } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { toZonedTime, format as formatTz } from 'date-fns-tz'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useLocations } from '@/hooks/use-locations'

interface CreateTripDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface TripStop {
  id: string
  locationId: number
  stopOrder: number
  arrivalTime: Date | undefined
  departureTime: Date | undefined
  isPickup: boolean
}

// Helper function to format time for Vietnam timezone (24-hour format)
const formatTimeVN = (date: Date) => {
  if (!date) return ''
  const vnDate = toZonedTime(date, 'Asia/Ho_Chi_Minh')
  return formatTz(vnDate, 'HH:mm', { timeZone: 'Asia/Ho_Chi_Minh' })
}

// Helper function to format date for Vietnam
const formatDateVN = (date: Date) => {
  if (!date) return ''
  const vnDate = toZonedTime(date, 'Asia/Ho_Chi_Minh')
  return formatTz(vnDate, 'dd/MM/yyyy', { timeZone: 'Asia/Ho_Chi_Minh', locale: vi })
}

// Helper function to create date with Vietnam timezone (returns UTC date for backend)
const createDateWithVNTime = (timeString: string, baseDate?: Date) => {
  const [hours, minutes] = timeString.split(':')
  // Use the selected departure date as base if provided, else today
  const date = baseDate ? new Date(baseDate) : new Date()
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0)
  date.setSeconds(0, 0)
  return new Date(date)
}

export const CreateTripDialog = ({ open, onOpenChange }: CreateTripDialogProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    note: '',
    departureDate: undefined as Date | undefined,
  })
  const [tripStops, setTripStops] = useState<TripStop[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loadingVehicles, setLoadingVehicles] = useState(false)
  const [errorVehicles, setErrorVehicles] = useState<string | null>(null)
  const [drivers, setDrivers] = useState<any[]>([])
  const [loadingDrivers, setLoadingDrivers] = useState(false)
  const [errorDrivers, setErrorDrivers] = useState<string | null>(null)

  // Get available drivers
  const { locations, loading: loadingLocations, error: errorLocations } = useLocations()

  useEffect(() => {
    if (open) {
      setLoadingVehicles(true)
      fetch('/api/vehicles')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setVehicles(data.data)
            setErrorVehicles(null)
          } else {
            setErrorVehicles(data.error || 'Failed to fetch vehicles')
          }
        })
        .catch(() => setErrorVehicles('Failed to fetch vehicles'))
        .finally(() => setLoadingVehicles(false))

      setLoadingDrivers(true)
      fetch('/api/users')
        .then((res) => res.json())
        .then((data) => {
          if (data.statusCode === 200 && data.data) {
            // Lọc role === 'employee' (hoặc 'EMPLOYEE' tuỳ backend)
            setDrivers(data.data.filter((u: any) => u.role === 'employee' || u.role === 'EMPLOYEE'))
            setErrorDrivers(null)
          } else {
            setErrorDrivers(data.message || 'Failed to fetch drivers')
          }
        })
        .catch(() => setErrorDrivers('Failed to fetch drivers'))
        .finally(() => setLoadingDrivers(false))
    }
  }, [open])

  const handleAddStop = () => {
    const newStop: TripStop = {
      id: Date.now().toString(),
      locationId: 0,
      stopOrder: tripStops.length + 1,
      arrivalTime: undefined,
      departureTime: undefined,
      isPickup: tripStops.length === 0, // First stop is pickup by default
    }
    setTripStops([...tripStops, newStop])
  }

  const handleRemoveStop = (stopId: string) => {
    setTripStops(tripStops.filter((stop) => stop.id !== stopId))
  }

  const handleStopChange = (stopId: string, field: keyof TripStop, value: any) => {
    setTripStops(tripStops.map((stop) => (stop.id === stopId ? { ...stop, [field]: value } : stop)))
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        vehicleId: formData.vehicleId,
        driverId: formData.driverId,
        note: formData.note,
        tripStops: tripStops.map((stop, idx) => ({
          locationId: stop.locationId,
          stopOrder: idx + 1,
          arrivalTime: stop.arrivalTime ? stop.arrivalTime.toISOString() : null,
          departureTime: stop.departureTime ? stop.departureTime.toISOString() : null,
          isPickup: stop.isPickup,
        })),
      }

      const res = await fetch('/api/trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (res.ok && data.statusCode === 201) {
        toast.success('Trip created successfully')
        onOpenChange(false)
        setCurrentStep(1)
        setFormData({
          vehicleId: '',
          driverId: '',
          note: '',
          departureDate: undefined,
        })
        setTripStops([])
      } else {
        toast.error(data.message || 'Failed to create trip')
      }
    } catch (error) {
      toast.error('Failed to create trip')
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
              step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600',
            )}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={cn('w-16 h-0.5 mx-2', step < currentStep ? 'bg-blue-600' : 'bg-gray-200')}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Thông tin chuyến đi</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicle">Xe</Label>
          {loadingVehicles ? (
            <div>Đang tải xe...</div>
          ) : errorVehicles ? (
            <div className="text-red-500">{errorVehicles}</div>
          ) : (
            <Select
              value={formData.vehicleId}
              onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn xe" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.vehicleId} value={vehicle.vehicleId.toString()}>
                    <div className="flex flex-col">
                      <span>{vehicle.licensePlate}</span>
                      <span className="text-sm text-gray-500">{vehicle.vehicleType?.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="driver">Tài xế</Label>
          {loadingDrivers ? (
            <div>Đang tải tài xế...</div>
          ) : errorDrivers ? (
            <div className="text-red-500">{errorDrivers}</div>
          ) : (
            <Select
              value={formData.driverId}
              onValueChange={(value) => setFormData({ ...formData, driverId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn tài xế" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((driver) => (
                  <SelectItem key={driver.userId} value={driver.userId.toString()}>
                    <div className="flex flex-col">
                      <span>{driver.name}</span>
                      <span className="text-sm text-gray-500">{driver.phone}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="departureDate">Ngày khởi hành</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !formData.departureDate && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.departureDate
                ? formatDateVN(formData.departureDate)
                : 'Chọn ngày khởi hành'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.departureDate}
              onSelect={(date) => setFormData({ ...formData, departureDate: date })}
              initialFocus
              locale={vi}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Ghi chú</Label>
        <Textarea
          id="note"
          placeholder="Thêm ghi chú về chuyến đi..."
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Điểm dừng</h3>
        <Button onClick={handleAddStop} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Thêm điểm dừng
        </Button>
      </div>

      {loadingLocations && <div>Đang tải điểm dừng...</div>}
      {errorLocations && <div className="text-red-500">{errorLocations}</div>}

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {tripStops.map((stop, index) => (
          <Card key={stop.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <CardTitle className="text-sm">Điểm dừng {index + 1}</CardTitle>
                  <Badge variant={stop.isPickup ? 'default' : 'secondary'}>
                    {stop.isPickup ? 'Đón khách' : 'Trả khách'}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveStop(stop.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Địa điểm</Label>
                  <Select
                    value={stop.locationId.toString()}
                    onValueChange={(value) =>
                      handleStopChange(stop.id, 'locationId', parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn địa điểm" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem
                          key={location.locationId}
                          value={location.locationId.toString()}
                        >
                          <div className="flex flex-col">
                            <span>{location.detail}</span>
                            <span className="text-sm text-gray-500">{location.province}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Loại điểm dừng</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`pickup-${stop.id}`}
                      checked={stop.isPickup}
                      onCheckedChange={(checked) => handleStopChange(stop.id, 'isPickup', checked)}
                    />
                    <Label htmlFor={`pickup-${stop.id}`}>Điểm đón khách</Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Giờ đến</Label>
                  <Input
                    type="time"
                    lang="vi"
                    value={stop.arrivalTime ? formatTimeVN(stop.arrivalTime) : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        const date = createDateWithVNTime(e.target.value, formData.departureDate)
                        handleStopChange(stop.id, 'arrivalTime', date)
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Giờ đi</Label>
                  <Input
                    type="time"
                    lang="vi"
                    value={stop.departureTime ? formatTimeVN(stop.departureTime) : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        const date = createDateWithVNTime(e.target.value, formData.departureDate)
                        handleStopChange(stop.id, 'departureTime', date)
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {tripStops.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Chưa có điểm dừng nào. Nhấn "Thêm điểm dừng" để tạo điểm dừng đầu tiên.</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Xem lại & Xác nhận</h3>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tóm tắt chuyến đi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Xe</Label>
              <p className="text-sm text-gray-600">
                {vehicles.find((v) => v.vehicleId.toString() === formData.vehicleId)
                  ?.licensePlate || 'Chưa chọn'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Tài xế</Label>
              <p className="text-sm text-gray-600">
                {drivers.find((d) => d.userId.toString() === formData.driverId)?.name ||
                  'Chưa chọn'}
              </p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Ngày khởi hành</Label>
            <p className="text-sm text-gray-600">
              {formData.departureDate ? formatDateVN(formData.departureDate) : 'Chưa chọn'}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium">Ghi chú</Label>
            <p className="text-sm text-gray-600">{formData.note || 'Không có ghi chú'}</p>
          </div>

          <div>
            <Label className="text-sm font-medium">Điểm dừng ({tripStops.length})</Label>
            <div className="space-y-2 mt-1">
              {tripStops.map((stop, index) => {
                const location = locations.find((l: any) => l.locationId === stop.locationId)
                return (
                  <div key={stop.id} className="flex items-center justify-between text-sm">
                    <span>
                      {index + 1}. {location?.detail || 'Địa điểm chưa xác định'}
                    </span>
                    <Badge variant={stop.isPickup ? 'default' : 'secondary'} className="text-xs">
                      {stop.isPickup ? 'Đón khách' : 'Trả khách'}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo chuyến đi mới</DialogTitle>
        </DialogHeader>

        {renderStepIndicator()}

        <div className="min-h-[400px]">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
            Quay lại
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            {currentStep < 3 ? (
              <Button onClick={handleNext}>Tiếp tục</Button>
            ) : (
              <Button onClick={handleSubmit}>Tạo chuyến đi</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
