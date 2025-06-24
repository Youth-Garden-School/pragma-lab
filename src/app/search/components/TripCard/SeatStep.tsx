// SeatStep.tsx
import { Armchair, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import React from "react"
import { Trip, Seat } from "../../mockTrips"

interface SeatStepProps {
  trip: Trip
  selectedSeats: string[]
  setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>
  onNext: () => void
}

export default function SeatStep({
  trip,
  selectedSeats,
  setSelectedSeats,
  onNext,
}: SeatStepProps) {
  const handleToggleSeat = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Chú thích và sơ đồ ghế */}
      <div className="flex justify-center gap-x-16">
        {/* Chú thích */}
        <div className="space-y-3 text-sm">
          <p className="font-semibold text-gray-700">Chú thích</p>

          {/* Ghế còn trống */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 relative flex items-center justify-center text-gray-500">
              <Armchair className="w-10 h-10" strokeWidth={1} />
            </div>
            <span>Còn trống</span>
          </div>

          {/* Ghế không bán */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 relative flex items-center justify-center text-gray-400">
              <Armchair className="w-10 h-10" strokeWidth={1} style={{ fill: "#e5e7eb" }} />
              <X className="w-5 h-5 absolute text-gray-400 bg-gray-200" style={{ top: "9px", right: "10px" }} />
            </div>
            <span>Ghế không bán</span>
          </div>

          {/* Ghế đang chọn */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 relative flex items-center justify-center text-green-600">
              <Armchair className="w-10 h-10" strokeWidth={1} style={{ fill: "#bbf7d0" }} />
              <Check className="w-5 h-5 absolute text-green-600 bg-green-200" style={{ bottom: "11px", right: "10px" }} />
            </div>
            <span>Đang chọn</span>
          </div>
        </div>

        {/* Sơ đồ ghế */}
        <div className="bg-gray-100 rounded-xl p-6">
          <div className="grid grid-cols-3 gap-3">
            {trip.seatMap.map((seat, idx) => {
              const isSelected = selectedSeats.includes(seat.id)
              const isDisabled = seat.status === "sold"

              return (
                <button
                  key={seat.id}
                  disabled={isDisabled}
                  onClick={() => handleToggleSeat(seat.id)}
                  className="relative w-10 h-10"
                >
                  {/* Ghế đã bán */}
                  {seat.status === "sold" && (
                    <div className="w-10 h-10 relative flex items-center justify-center text-gray-400">
                      <Armchair
                        className="w-10 h-10"
                        strokeWidth={1}
                        style={{ fill: "#e5e7eb" }}
                      />
                      <X
                        className="w-5 h-5 absolute text-gray-400 bg-gray-200"
                        style={{ top: "9px", right: "10px" }}
                      />
                    </div>
                  )}

                  {/* Ghế đang chọn */}
                  {seat.status === "available" && isSelected && (
                    <div className="w-10 h-10 relative flex items-center justify-center text-green-600">
                      <Armchair
                        className="w-10 h-10"
                        strokeWidth={1}
                        style={{ fill: "#bbf7d0" }}
                      />
                      <Check
                        className="w-5 h-5 absolute text-green-600 bg-green-200"
                        style={{ bottom: "11px", right: "10px" }}
                      />
                    </div>
                  )}

                  {/* Ghế còn trống */}
                  {seat.status === "available" && !isSelected && (
                    <div className="w-10 h-10 relative flex items-center justify-center text-gray-500">
                      <Armchair className="w-10 h-10" strokeWidth={1} />
                      {idx !== 0 && (
                        <span className="absolute text-[10px] font-semibold text-gray-500" style={{ bottom: "16px", left: "16px" }}>
                          {seat.id}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tổng tiền và tiếp tục */}
      <div className="flex justify-between items-center px-2">
        {selectedSeats.length > 0 ? (
          <div className="text-sm">
            Ghế: <span className="font-semibold text-blue-700">{selectedSeats.join(", ")}</span>
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-4 text-sm">
          <span>
            Tổng cộng: <span className="text-blue-700 font-bold">{(trip.price * selectedSeats.length).toLocaleString()}đ</span>
          </span>
          <Button
            onClick={onNext}
            disabled={selectedSeats.length === 0}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
          >
            Tiếp tục
          </Button>
        </div>
      </div>
    </div>
  )
}
