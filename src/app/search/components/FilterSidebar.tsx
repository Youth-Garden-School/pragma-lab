import { Button } from "@/components/ui/button"
import React from "react"
import { Location, filterOptions } from "../mockdata"

type Props = {
  selectedDepartureTimes: string[]
  selectedVehicleTypes: string[]
  selectedSeatPositions: string[]
  selectedPickupPoints: string[]
  selectedDropoffPoints: string[]
  pickupFilterPoints: Location[]
  dropoffFilterPoints: Location[]
  onToggle: (item: string, list: string[], setList: (val: string[]) => void) => void
  clearAll: () => void
  setSelectedDepartureTimes: (val: string[]) => void
  setSelectedVehicleTypes: (val: string[]) => void
  setSelectedSeatPositions: (val: string[]) => void
  setSelectedPickupPoints: (val: string[]) => void
  setSelectedDropoffPoints: (val: string[]) => void
}

export default function TripFilterSidebar({
  selectedDepartureTimes,
  selectedVehicleTypes,
  selectedSeatPositions,
  selectedPickupPoints,
  selectedDropoffPoints,
  pickupFilterPoints,
  dropoffFilterPoints,
  onToggle,
  clearAll,
  setSelectedDepartureTimes,
  setSelectedVehicleTypes,
  setSelectedSeatPositions,
  setSelectedPickupPoints,
  setSelectedDropoffPoints,
}: Props) {
  return (
    <aside className="w-64 bg-white border rounded-xl p-4 space-y-6">
      <div className="w-full flex bg-gray-100 rounded overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 flex-1">
          <h2 className="text-lg font-semibold">Lọc</h2>
        </div>
        {(selectedDepartureTimes.length || selectedVehicleTypes.length || selectedSeatPositions.length || selectedPickupPoints.length || selectedDropoffPoints.length) > 0 && (
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Xóa lọc
          </button>
        )}
      </div>

      <div className="w-full">
        <p className="font-medium mb-1">Giờ đi</p>
        <div className="grid grid-cols-2 gap-2">
          {filterOptions.departureTimes.map((opt) => (
            <Button
              key={opt}
              variant={selectedDepartureTimes.includes(opt) ? "default" : "outline"}
              className={selectedDepartureTimes.includes(opt) ? "bg-cyan-400 text-white hover:bg-cyan-400" : "bg-gray-100 hover:bg-gray-200"}
              onClick={() => onToggle(opt, selectedDepartureTimes, setSelectedDepartureTimes)}
            >
              {opt}
            </Button>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="font-medium mb-1">Loại xe</p>
        {filterOptions.vehicleTypes.map((opt) => (
          <label key={opt.name} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedVehicleTypes.includes(opt.name)}
              onChange={() => onToggle(opt.name, selectedVehicleTypes, setSelectedVehicleTypes)}
            />
            {opt.name}
          </label>
        ))}
      </div>

      <div className="w-full">
        <p className="font-medium mb-1">Vị trí ghế</p>
        {filterOptions.seatPositions.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedSeatPositions.includes(opt)}
              onChange={() => onToggle(opt, selectedSeatPositions, setSelectedSeatPositions)}
            />
            {opt}
          </label>
        ))}
      </div>

      <div className="w-full">
        <p className="font-medium mb-1">Điểm đón</p>
        {pickupFilterPoints.map((p) => (
          <label key={p.locationId} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedPickupPoints.includes(p.detail)}
              onChange={() => onToggle(p.detail, selectedPickupPoints, setSelectedPickupPoints)}
            />
            {p.detail}
          </label>
        ))}
      </div>

      <div className="w-full">
        <p className="font-medium mb-1">Điểm trả</p>
        {dropoffFilterPoints.map((p) => (
          <label key={p.locationId} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedDropoffPoints.includes(p.detail)}
              onChange={() => onToggle(p.detail, selectedDropoffPoints, setSelectedDropoffPoints)}
            />
            {p.detail}
          </label>
        ))}
      </div>
    </aside>
  )
}
