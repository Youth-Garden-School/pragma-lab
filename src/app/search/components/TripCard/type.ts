
import { Seat, Trip, PickupDropPoint } from "../../mockTrips"

export interface BuyerInfo {
  fullName: string
  phone: string
  email: string
  note: string
  wantInvoice: boolean
}

export type Step = 1 | 2 | 3

export interface SeatStepProps {
  seats: Seat[]
  selectedSeats: string[]
  price: number
  onToggleSeat: (seatId: string) => void
  onNext: () => void
}

export interface PickupDropStepProps {
  pickupPoints: PickupDropPoint[]
  dropoffPoints: PickupDropPoint[]
  selectedPickup: string
  selectedDropoff: string
  onSelectPickup: (address: string) => void
  onSelectDropoff: (address: string) => void
  onNext: () => void
  onBack: () => void
}

export interface BuyerInfoStepProps {
  buyerInfo: BuyerInfo
  onChange: (info: Partial<BuyerInfo>) => void
  onBack: () => void
  onSubmit: () => void
}
