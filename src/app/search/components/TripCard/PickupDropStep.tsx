import { Button } from "@/components/ui/button"
import React from "react"
import { Trip, PickupDropPoint, TripStop } from "../../mockTrips"

interface PickupDropStepProps {
  pickupPoints: TripStop[]
  dropoffPoints: TripStop[]
  selectedPickup: string
  selectedDropoff: string
  onSelectPickup: (detail: string) => void
  onSelectDropoff: (detail: string) => void
  onNext: () => void
}

export default function PickupDropStep({
  pickupPoints,
  dropoffPoints,
  selectedPickup,
  selectedDropoff,
  onSelectPickup,
  onSelectDropoff,
  onNext,
}: PickupDropStepProps) {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="font-medium mb-1">Điểm đón</p>
          {pickupPoints.map((point) => (
            <label key={point.arrivalTime} className="flex items-center gap-2 py-1">
              <input
                type="radio"
                name="pickup"
                value={point.location.detail}
                checked={selectedPickup === point.location.detail}
                onChange={() => onSelectPickup(point.location.detail || "")}
              />
              <span>{point.arrivalTime} - {point.location.detail}</span>
            </label>
          ))}
        </div>
        <div>
          <p className="font-medium mb-1">Điểm trả</p>
          {dropoffPoints.map((point) => (
            <label key={point.arrivalTime} className="flex items-center gap-2 py-1">
              <input
                type="radio"
                name="dropoff"
                value={point.location.detail}
                checked={selectedDropoff === point.location.detail}
                onChange={() => onSelectDropoff(point.location.detail || "")}
              />
              <span>{point.arrivalTime} - {point.location.detail}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
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
