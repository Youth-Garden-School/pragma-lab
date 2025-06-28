import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import StepIndicator from '../StepIndicator'
import PickupDropStep from './PickupDropStep'
import BuyerInfoStep from './BuyerInfoStep'
import { Trip } from '../../mockTrips'
import { BuyerInfo } from './type'
import { toast } from 'sonner'

interface TripCardProps {
  trip: any
  expandedTripId: string | null
  setExpandedTripId: (id: string | null) => void
}

export default function TripCard({ trip, expandedTripId, setExpandedTripId }: TripCardProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    fullName: '',
    phone: '',
    email: '',
    note: '',
    wantInvoice: false,
  })

  const [selectedPickup, setSelectedPickup] = useState<string>('')
  const [selectedDropoff, setSelectedDropoff] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const isExpanded = expandedTripId === String(trip.tripId)

  // Fetch userId when expanded
  useEffect(() => {
    if (isExpanded) {
      fetch('/api/users/me')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.data && data.data.userId) setUserId(String(data.data.userId))
          else setUserId('')
        })
        .catch(() => setUserId(''))
    }
  }, [isExpanded])

  // Tính số ghế còn trống và ghế tiếp theo từ _count.tickets
  const totalSeats = trip.vehicle?.vehicleType?.seatCapacity || 0
  const bookedTicketsCount = trip._count?.tickets || 0
  const availableSeats = totalSeats - bookedTicketsCount
  const pricePerSeat = Number(trip.vehicle?.vehicleType?.pricePerSeat) || 0
  const pickupStops = trip.tripStops?.filter((s: any) => s.isPickup) || []
  const dropoffStops = trip.tripStops?.filter((s: any) => !s.isPickup) || []

  // Hàm tìm ghế tiếp theo
  const getNextAvailableSeat = (): string => {
    const nextSeatNumber = bookedTicketsCount + 1
    return nextSeatNumber <= totalSeats ? String(nextSeatNumber) : ''
  }

  const handleSelectTrip = () => {
    if (isExpanded) {
      setExpandedTripId(null)
      setStep(1)
      setBuyerInfo({ fullName: '', phone: '', email: '', note: '', wantInvoice: false })
    } else {
      setExpandedTripId(String(trip.tripId))
      setStep(1)
      setBuyerInfo({ fullName: '', phone: '', email: '', note: '', wantInvoice: false })
    }
  }

  const handleSubmit = async () => {
    const nextSeat = getNextAvailableSeat()

    if (!nextSeat) {
      toast.error('Không còn ghế trống trên chuyến này!')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Number(userId) || 0,
          tripId: Number(trip.tripId),
          pickupStopId: Number(selectedPickup) || 0,
          dropoffStopId: Number(selectedDropoff) || 0,
          seatNumber: nextSeat,
          price: pricePerSeat,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Đặt vé thất bại!')
      }

      toast.success(`Đặt vé thành công! Ghế số: ${nextSeat}`)

      setExpandedTripId(null)
      setStep(1)
      setSelectedPickup('')
      setSelectedDropoff('')
      setBuyerInfo({ fullName: '', phone: '', email: '', note: '', wantInvoice: false })
    } catch (err: any) {
      toast.error(err.message || 'Đặt vé thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  return (
    <Card className="overflow-hidden border border-gray-200 hover:border-[#06b6d4] transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            {/* Vehicle Info */}
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/20"
              >
                {trip.vehicle?.vehicleType?.name}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{totalSeats} chỗ</span>
              </div>
            </div>

            {/* Time and Route */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-lg font-semibold">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-[#06b6d4]" />
                  <span>{formatTime(trip.departureTime || pickupStops[0]?.departureTime)}</span>
                </div>
                <div className="flex-1 border-t border-dashed border-gray-300 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white px-2 text-xs text-gray-500">
                      {Math.floor(Math.random() * 3 + 6)}h {Math.floor(Math.random() * 60)}m
                    </div>
                  </div>
                </div>
                <span>{formatTime(trip.arrivalTime || dropoffStops[0]?.arrivalTime)}</span>
              </div>

              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-[#06b6d4] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">{pickupStops[0]?.location?.detail}</div>
                  <div className="text-xs text-gray-500">{pickupStops[0]?.location?.province}</div>
                </div>
                <span className="text-gray-400 mx-2">→</span>
                <div>
                  <div className="font-medium">{dropoffStops[0]?.location?.detail}</div>
                  <div className="text-xs text-gray-500">{dropoffStops[0]?.location?.province}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Price and Booking */}
          <div className="text-right space-y-3 ml-6">
            <div>
              <div className="flex items-center justify-end gap-2 mb-1">
                <div
                  className={`flex items-center gap-1 text-sm ${availableSeats > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {availableSeats > 0 ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span>{availableSeats > 0 ? `Còn ${availableSeats} chỗ` : 'Hết chỗ'}</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-1 text-2xl font-bold text-[#06b6d4]">
                <span>{formatPrice(pricePerSeat)}đ</span>
              </div>
            </div>

            <Button
              onClick={handleSelectTrip}
              disabled={availableSeats === 0}
              className={`min-w-[120px] ${
                isExpanded
                  ? 'bg-gray-500 hover:bg-gray-600'
                  : availableSeats === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-[#06b6d4] hover:bg-[#0891b2] shadow-lg hover:shadow-xl'
              } transition-all duration-200`}
            >
              {isExpanded ? (
                <>
                  Thu gọn <ChevronUp className="w-4 h-4 ml-1" />
                </>
              ) : availableSeats === 0 ? (
                'Hết chỗ'
              ) : (
                <>
                  Chọn chuyến <ChevronDown className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <Separator className="mb-6" />

          <div className="space-y-6">
            <StepIndicator step={step} />

            {availableSeats === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Chuyến này đã hết chỗ!</h4>
                  <p className="text-sm text-red-600 mt-1">
                    Vui lòng chọn chuyến khác hoặc thời gian khác.
                  </p>
                </div>
              </div>
            )}

            {availableSeats > 0 && step === 1 && (
              <div className="space-y-4">
                <PickupDropStep
                  pickupPoints={pickupStops as any[]}
                  dropoffPoints={dropoffStops as any[]}
                  selectedPickup={selectedPickup}
                  selectedDropoff={selectedDropoff}
                  onSelectPickup={(stopId: string) => setSelectedPickup(stopId)}
                  onSelectDropoff={(stopId: string) => setSelectedDropoff(stopId)}
                  onNext={() => setStep(2)}
                />
              </div>
            )}

            {availableSeats > 0 && step === 2 && (
              <div className="space-y-4">
                <div className="bg-[#06b6d4]/5 border border-[#06b6d4]/20 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#06b6d4] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-[#06b6d4]">Ghế được chọn tự động</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Hệ thống sẽ tự động chọn <strong>ghế số {getNextAvailableSeat()}</strong> cho
                      bạn
                    </p>
                  </div>
                </div>

                <BuyerInfoStep
                  buyerInfo={buyerInfo as BuyerInfo}
                  onChange={(field: keyof BuyerInfo, value: string | boolean) => {
                    setBuyerInfo((prev) => ({ ...prev, [field]: value }))
                  }}
                  onBack={() => setStep(1)}
                  onSubmit={handleSubmit}
                />
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center gap-3 p-4 bg-[#06b6d4]/5 rounded-lg">
                <div className="animate-spin w-5 h-5 border-2 border-[#06b6d4] border-t-transparent rounded-full"></div>
                <span className="text-[#06b6d4] font-medium">Đang xử lý đặt vé...</span>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
