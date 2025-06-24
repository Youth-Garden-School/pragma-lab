import { Button } from "@/components/ui/button"
import React from "react"
import { Trip, PickupDropPoint } from "../../mockTrips"

interface PickupDropStepProps {
  pickupPoints: PickupDropPoint[]
  dropoffPoints: PickupDropPoint[]
  selectedPickup: string
  selectedDropoff: string
  onSelectPickup: (address: string) => void
  onSelectDropoff: (address: string) => void
  onNext: () => void
  onBack: () => void
}

export default function PickupDropStep({
  pickupPoints,
  dropoffPoints,
  selectedPickup,
  selectedDropoff,
  onSelectPickup,
  onSelectDropoff,
  onNext,
  onBack,
}: PickupDropStepProps) {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="font-medium mb-1">Điểm đón</p>
          {pickupPoints.map((point) => (
            <label key={point.time} className="flex items-center gap-2 py-1">
              <input
                type="radio"
                name="pickup"
                value={point.address}
                checked={selectedPickup === point.address}
                onChange={() => onSelectPickup(point.address || "")}
              />
              <span>{point.time} - {point.address}</span>
            </label>
          ))}
        </div>
        <div>
          <p className="font-medium mb-1">Điểm trả</p>
          {dropoffPoints.map((point) => (
            <label key={point.time} className="flex items-center gap-2 py-1">
              <input
                type="radio"
                name="dropoff"
                value={point.address}
                checked={selectedDropoff === point.address}
                onChange={() => onSelectDropoff(point.address || "")}
              />
              <span>{point.time} - {point.address}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-between">
        <Button
          variant="outline"
          className="bg-gray-600 hover:bg-red-500 text-white hover:text-white"
          onClick={onBack}
        >
          Quay lại
        </Button>
        <Button
          className="bg-cyan-400 hover:bg-cyan-400 text-white"
          onClick={onNext}
          disabled={!selectedPickup || !selectedDropoff}
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  )
}
