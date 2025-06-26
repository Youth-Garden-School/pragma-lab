import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import StepIndicator from '../StepIndicator'
import PickupDropStep from './PickupDropStep'
import BuyerInfoStep from './BuyerInfoStep'
import { Trip } from '../../mockTrips'
import { BuyerInfo } from './type'

interface TripCardProps {
  trip: any // sửa lại cho nhận trip từ API
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
  const [locations, setLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const isExpanded = expandedTripId === String(trip.tripId)

  // Fetch userId and locations when expanded
  useEffect(() => {
    if (isExpanded) {
      // Fetch userId from /api/users/me (get from data.userId)
      fetch('/api/users/me')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.data && data.data.userId) setUserId(String(data.data.userId))
          else setUserId('')
        })
        .catch(() => setUserId(''))
    }
  }, [isExpanded])

  // Lấy số ghế trống và giá từ trip
  const seatCapacity = trip.vehicle?.vehicleType?.seatCapacity || 0
  const pricePerSeat = trip.vehicle?.vehicleType?.pricePerSeat || 0
  const pickupStops = trip.tripStops?.filter((s: any) => s.isPickup) || []
  const dropoffStops = trip.tripStops?.filter((s: any) => !s.isPickup) || []

  // Khi chọn điểm đón/trả, lưu stopId (không phải locationId)
  const handleSelectPickup = (stopId: string) => setSelectedPickup(stopId)
  const handleSelectDropoff = (stopId: string) => setSelectedDropoff(stopId)

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
    setLoading(true)
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: Number(userId) || 0,
          tripId: Number(trip.tripId),
          pickupStopId: Number(selectedPickup) || 0, // stopId
          dropoffStopId: Number(selectedDropoff) || 0, // stopId
          seatNumber: '2',
          price: pricePerSeat,
        }),
      })
      if (!res.ok) throw new Error('Đặt vé thất bại!')
      alert('Đặt vé thành công!')
      setExpandedTripId(null)
      setStep(1)
      setSelectedPickup('')
      setSelectedDropoff('')
      setBuyerInfo({
        fullName: '',
        phone: '',
        email: '',
        note: '',
        wantInvoice: false,
      })
    } catch (err) {
      alert('Đặt vé thất bại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border rounded-xl p-4 space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">{trip.vehicle?.vehicleType?.name}</p>
          <p className="text-gray-600">
            {trip.departureTime} → {trip.arrivalTime}
          </p>
          <p className="text-sm">
            {pickupStops[0]?.location?.detail} → {dropoffStops[0]?.location?.detail}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm">Còn {seatCapacity} chỗ trống</p>
          <p className="font-bold text-lg text-blue-600">Từ {pricePerSeat.toLocaleString()}đ</p>
          <Button
            className="bg-cyan-500 hover:bg-cyan-500 text-white font-bold"
            onClick={handleSelectTrip}
          >
            Chọn chuyến
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t pt-4 space-y-4">
          <StepIndicator step={step} />

          {step === 1 && (
            <PickupDropStep
              pickupPoints={pickupStops as any[]}
              dropoffPoints={dropoffStops as any[]}
              selectedPickup={selectedPickup}
              selectedDropoff={selectedDropoff}
              onSelectPickup={handleSelectPickup}
              onSelectDropoff={handleSelectDropoff}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <BuyerInfoStep
              buyerInfo={buyerInfo as BuyerInfo}
              onChange={(field: keyof BuyerInfo, value: string | boolean) => {
                setBuyerInfo((prev) => ({ ...prev, [field]: value }))
              }}
              onBack={() => setStep(1)}
              onSubmit={handleSubmit}
            />
          )}

          {loading && <div className="text-blue-500">Đang xử lý đặt vé...</div>}
        </div>
      )}
    </div>
  )
}
