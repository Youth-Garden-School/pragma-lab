export type SeatStatus = "available" | "sold" | "selected"

export type Seat = {
  id: string
  status: SeatStatus
}

export type Trip = {
  id: string
  vehicleType: string
  departureTime: string
  arrivalTime: string
  pickupPoint: string
  dropoffPoint: string
  price: number
  availableSeats: number
  seats: Seat[]
}

export const mockTrips: Trip[] = [
  {
    id: "trip1",
    vehicleType: "XE 16C",
    departureTime: "17:30",
    arrivalTime: "19:30",
    pickupPoint: "Bến xe Miền Đông",
    dropoffPoint: "BX Vũng Tàu - VT",
    price: 150000,
    availableSeats: 10,
    seats: [
      { id: "1", status: "sold" },
      { id: "2", status: "sold" },
      { id: "3", status: "sold" },
      { id: "4", status: "available" },
      { id: "5", status: "available" },
      { id: "6", status: "sold" },
      { id: "7", status: "available" },
      { id: "8", status: "sold" },
      { id: "9", status: "available" },
      { id: "10", status: "available" },
      { id: "11", status: "available" },
      { id: "12", status: "available" },
      { id: "13", status: "available" },
      { id: "14", status: "available" },
      { id: "15", status: "available" },
    ]
  },
  {
    id: "trip2",
    vehicleType: "XE 16C",
    departureTime: "17:30",
    arrivalTime: "19:30",
    pickupPoint: "Bến xe Miền Đông",
    dropoffPoint: "BX Vũng Tàu - VT",
    price: 150000,
    availableSeats: 10,
    seats: [
      { id: "1", status: "sold" },
      { id: "2", status: "sold" },
      { id: "3", status: "sold" },
      { id: "4", status: "available" },
      { id: "5", status: "available" },
      { id: "6", status: "sold" },
      { id: "7", status: "available" },
      { id: "8", status: "sold" },
      { id: "9", status: "available" },
      { id: "10", status: "available" },
      { id: "11", status: "available" },
      { id: "12", status: "available" },
      { id: "13", status: "available" },
      { id: "14", status: "available" },
      { id: "15", status: "available" },
    ]
  },
  // có thể thêm nhiều trip khác...
]
