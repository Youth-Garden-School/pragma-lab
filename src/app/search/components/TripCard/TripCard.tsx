import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import StepIndicator from "../StepIndicator"
import PickupDropStep from "./PickupDropStep"
import BuyerInfoStep from "./BuyerInfoStep"
import { Trip } from "../../mockTrips"
import { BuyerInfo } from "./type"

interface TripCardProps {
    trip: Trip
    expandedTripId: string | null
    setExpandedTripId: (id: string | null) => void
}

export default function TripCard({ trip, expandedTripId, setExpandedTripId }: TripCardProps) {
    const [step, setStep] = useState<1 | 2>(1)
    // const [selectedSeats, setSelectedSeats] = useState<string[]>([])
    const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
        fullName: "",
        phone: "",
        email: "",
        note: "",
        wantInvoice: false,
    })

    const [selectedPickup, setSelectedPickup] = useState("");
    const [selectedDropoff, setSelectedDropoff] = useState("");

    const isExpanded = expandedTripId === trip.TripId

    const handleSelectTrip = () => {
        if (isExpanded) {
            setExpandedTripId(null)
            setStep(1)
            // setSelectedSeats([])
            setBuyerInfo({ fullName: "", phone: "", email: "", note: "", wantInvoice: false })
        } else {
            setExpandedTripId(trip.TripId)
            setStep(1)
            // setSelectedSeats([])
            setBuyerInfo({ fullName: "", phone: "", email: "", note: "", wantInvoice: false })
        }
    }

    return (
        <div className="bg-white border rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold">{trip.vehicle.vehicleType.name}</p>
                    <p className="text-gray-600">{trip.departureTime} → {trip.arrivalTime}</p>
                    <p className="text-sm">{trip.pickupStops?.[0].location.detail} → {trip.dropoffStops?.[0].location.detail}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm">Còn {trip.vehicletype.seatCapacity} chỗ trống</p>
                    <p className="font-bold text-lg text-blue-600">Từ {trip.vehicletype.pricePerSeat.toLocaleString()}đ</p>
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
                            pickupPoints={trip.pickupStops}
                            dropoffPoints={trip.dropoffStops}
                            selectedPickup={selectedPickup}
                            selectedDropoff={selectedDropoff}
                            onSelectPickup={setSelectedPickup}
                            onSelectDropoff={setSelectedDropoff}
                            onNext={() => setStep(2)}
                        />
                    )}

                    {step === 2 && (
                    <BuyerInfoStep
                        buyerInfo={buyerInfo}
                        onChange={(field, value) => {
                        setBuyerInfo((prev) => ({
                            ...prev,
                            [field]: value,
                        }))
                        }}
                        onBack={() => setStep(1)}
                        onSubmit={() => {
                        // Xử lý logic đặt vé ở đây
                        console.log("Thông tin đặt vé:", {
                            tripId: trip.TripId,
                            pickup: selectedPickup,
                            dropoff: selectedDropoff,
                            buyerInfo,
                        })

                        // Sau khi đặt vé thành công, có thể reset form:
                        setExpandedTripId(null)
                        setStep(1)
                        setSelectedPickup("")
                        setSelectedDropoff("")
                        setBuyerInfo({
                            fullName: "",
                            phone: "",
                            email: "",
                            note: "",
                            wantInvoice: false,
                        })
                        }}
                    />
                    )}
                </div>
            )}
        </div>
    )
}
