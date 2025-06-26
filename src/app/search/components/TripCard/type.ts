import { Trip, PickupDropPoint } from '../../mockTrips'

export interface BuyerInfo {
  fullName: string
  phone: string
  email: string
  note: string
  wantInvoice: boolean
}

export type Step = 1 | 2

export interface PickupDropStepProps {
  pickupPoints: any[]
  dropoffPoints: any[]
  selectedPickup: string
  selectedDropoff: string
  onSelectPickup: (address: string) => void
  onSelectDropoff: (address: string) => void
  onNext: () => void
}

export interface BuyerInfoStepProps {
  buyerInfo: BuyerInfo
  onChange: (info: Partial<BuyerInfo>) => void
  onBack: () => void
  onSubmit: () => void
}
