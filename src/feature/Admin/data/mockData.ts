export enum Role {
  customer = 'customer',
  admin = 'admin',
  employee = 'employee',
}

export enum TripStatus {
  upcoming = 'upcoming',
  ongoing = 'ongoing',
  completed = 'completed',
  cancelled = 'cancelled',
  delayed = 'delayed',
}

export enum TicketStatus {
  booked = 'booked',
  cancelled = 'cancelled',
  completed = 'completed',
  refunded = 'refunded',
}

export enum PaymentMethod {
  cash = 'cash',
  card = 'card',
  momo = 'momo',
  banking = 'banking',
}

export enum NotificationType {
  email = 'email',
  phone = 'phone',
}

export enum NotificationStatus {
  sent = 'sent',
  failed = 'failed',
  pending = 'pending',
}

// Data interfaces - Updated to match Prisma schema exactly
export interface Users {
  userId: number
  phone: string
  dateOfBirth?: Date
  name: string
  email: string
  address?: string
  password: string
  role: Role
  // Relations (optional for fetching)
  tickets?: Tickets[]
  trips?: Trips[]
  notifications?: Notifications[]
}

export interface VehicleTypes {
  vehicleTypeId: number
  name: string
  seatCapacity: number
  pricePerSeat: number // Will be converted to Decimal in actual DB
  // Relations
  vehicles?: Vehicles[]
  seatConfigs?: SeatConfigurations[]
}

export interface SeatConfigurations {
  seatConfigId: number
  vehicleTypeId: number
  seatNumber: string
  rowNumber: number
  columnNumber: number
  isAvailable: boolean
  // Relations
  vehicleType?: VehicleTypes
}

export interface Vehicles {
  vehicleId: number
  licensePlate: string
  vehicleTypeId: number
  // Relations
  vehicleType?: VehicleTypes
  trips?: Trips[]
}

export interface Locations {
  locationId: number
  detail: string
  province: string
  // Relations
  tripStops?: TripStops[]
}

export interface Trips {
  tripId: number
  vehicleId: number
  driverId: number
  status: TripStatus
  note?: string
  createdAt: Date
  updatedAt: Date
  // Relations
  vehicle?: Vehicles
  driver?: Users
  tripStops?: TripStops[]
  tickets?: Tickets[]
  tripSeats?: TripSeats[]
}

export interface TripStops {
  tripStopId: number
  tripId: number
  locationId: number
  stopOrder: number
  arrivalTime: Date
  departureTime: Date
  isPickup: boolean
  // Relations
  trip?: Trips
  location?: Locations
  pickupTickets?: Tickets[]
  dropoffTickets?: Tickets[]
}

export interface Tickets {
  ticketId: number
  userId: number
  tripId: number
  pickupStopId: number
  dropoffStopId: number
  seatNumber: string
  price: number // Will be converted to Decimal in actual DB
  status: TicketStatus
  createdAt: Date
  updatedAt: Date
  // Relations
  user?: Users
  trip?: Trips
  pickupStop?: TripStops
  dropoffStop?: TripStops
  payments?: Payments[]
  tripSeats?: TripSeats[]
  notifications?: Notifications[]
}

export interface Payments {
  paymentId: number
  ticketId: number
  amount: number // Will be converted to Decimal in actual DB
  method: PaymentMethod
  paidAt: Date
  createdAt: Date
  updatedAt: Date
  // Relations
  ticket?: Tickets
}

export interface TripSeats {
  tripId: number
  seatNumber: string
  isBooked: boolean
  ticketId?: number
  // Relations
  trip?: Trips
  ticket?: Tickets
}

export interface Notifications {
  notificationId: number
  ticketId: number
  userId: number
  type: NotificationType
  message: string
  sentAt: Date
  status: NotificationStatus
  createdAt: Date
  // Relations
  ticket?: Tickets
  user?: Users
}

// Complete Mock Data - Updated with correct interface names
export const mockUsers: Users[] = [
  {
    userId: 1,
    phone: '0123456789',
    name: 'Nguyễn Văn An',
    email: 'an@example.com',
    address: 'Hà Nội',
    password: '123456',
    role: Role.admin,
    dateOfBirth: new Date('1990-01-15'),
  },
  {
    userId: 2,
    phone: '0987654321',
    name: 'Trần Thị Bình',
    email: 'binh@example.com',
    address: 'TP.HCM',
    password: '123456',
    role: Role.employee,
    dateOfBirth: new Date('1992-03-20'),
  },
  {
    userId: 3,
    phone: '0345678912',
    name: 'Lê Văn Cường',
    email: 'cuong@example.com',
    address: 'Đà Nẵng',
    password: '123456',
    role: Role.customer,
    dateOfBirth: new Date('1985-07-10'),
  },
  {
    userId: 4,
    phone: '0567891234',
    name: 'Phạm Thị Dung',
    email: 'dung@example.com',
    address: 'Hải Phòng',
    password: '123456',
    role: Role.customer,
    dateOfBirth: new Date('1988-12-05'),
  },
  {
    userId: 5,
    phone: '0789123456',
    name: 'Hoàng Văn Em',
    email: 'em@example.com',
    address: 'Cần Thơ',
    password: '123456',
    role: Role.customer,
    dateOfBirth: new Date('1993-09-18'),
  },
]

export const mockVehicleTypes: VehicleTypes[] = [
  {
    vehicleTypeId: 1,
    name: 'Xe Limousine 22 chỗ',
    seatCapacity: 22,
    pricePerSeat: 250000,
  },
  {
    vehicleTypeId: 2,
    name: 'Xe Giường nằm 40 chỗ',
    seatCapacity: 40,
    pricePerSeat: 180000,
  },
  {
    vehicleTypeId: 3,
    name: 'Xe Ghế ngồi 45 chỗ',
    seatCapacity: 45,
    pricePerSeat: 150000,
  },
]

export const mockSeatConfigurations: SeatConfigurations[] = [
  // Limousine 22 chỗ (2 tầng, mỗi tầng 11 chỗ, 1 hàng 3 ghế)
  ...Array.from({ length: 22 }, (_, i) => ({
    seatConfigId: i + 1,
    vehicleTypeId: 1,
    seatNumber: `L${i + 1}`,
    rowNumber: Math.floor(i / 3) + 1,
    columnNumber: (i % 3) + 1,
    isAvailable: true,
  })),

  // Giường nằm 40 chỗ (2 tầng, mỗi tầng 20 chỗ, 1 hàng 2 giường)
  ...Array.from({ length: 40 }, (_, i) => ({
    seatConfigId: i + 23,
    vehicleTypeId: 2,
    seatNumber: `B${i + 1}`,
    rowNumber: Math.floor(i / 2) + 1,
    columnNumber: (i % 2) + 1,
    isAvailable: true,
  })),

  // Ghế ngồi 45 chỗ (1 tầng, 9 hàng x 5 ghế)
  ...Array.from({ length: 45 }, (_, i) => ({
    seatConfigId: i + 63,
    vehicleTypeId: 3,
    seatNumber: `S${i + 1}`,
    rowNumber: Math.floor(i / 5) + 1,
    columnNumber: (i % 5) + 1,
    isAvailable: true,
  })),
]

export const mockVehicles: Vehicles[] = [
  { vehicleId: 1, licensePlate: '29A-12345', vehicleTypeId: 1 },
  { vehicleId: 2, licensePlate: '30B-67890', vehicleTypeId: 2 },
  { vehicleId: 3, licensePlate: '51C-11111', vehicleTypeId: 3 },
  { vehicleId: 4, licensePlate: '92D-22222', vehicleTypeId: 1 },
  { vehicleId: 5, licensePlate: '43E-33333', vehicleTypeId: 2 },
]

export const mockLocations: Locations[] = [
  { locationId: 1, detail: 'Bến xe Mỹ Đình', province: 'Hà Nội' },
  { locationId: 2, detail: 'Bến xe Miền Đông', province: 'TP.HCM' },
  { locationId: 3, detail: 'Bến xe Đà Nẵng', province: 'Đà Nẵng' },
  { locationId: 4, detail: 'Bến xe Hải Phòng', province: 'Hải Phòng' },
  { locationId: 5, detail: 'Bến xe Cần Thơ', province: 'Cần Thơ' },
  { locationId: 6, detail: 'Bến xe Nha Trang', province: 'Khánh Hòa' },
  { locationId: 7, detail: 'Bến xe Huế', province: 'Thừa Thiên Huế' },
]

export const mockTrips: Trips[] = [
  {
    tripId: 1,
    vehicleId: 1,
    driverId: 2,
    status: TripStatus.upcoming,
    note: 'Chuyến đi sáng Hà Nội - TP.HCM',
    createdAt: new Date('2024-06-10T08:00:00Z'),
    updatedAt: new Date('2024-06-10T08:00:00Z'),
  },
  {
    tripId: 2,
    vehicleId: 2,
    driverId: 2,
    status: TripStatus.ongoing,
    note: 'Chuyến đi chiều Đà Nẵng - Hải Phòng',
    createdAt: new Date('2024-06-10T14:00:00Z'),
    updatedAt: new Date('2024-06-10T14:00:00Z'),
  },
  {
    tripId: 3,
    vehicleId: 3,
    driverId: 2,
    status: TripStatus.completed,
    note: 'Chuyến đi tối Cần Thơ - TP.HCM',
    createdAt: new Date('2024-06-09T20:00:00Z'),
    updatedAt: new Date('2024-06-10T06:00:00Z'),
  },
  {
    tripId: 4,
    vehicleId: 4,
    driverId: 2,
    status: TripStatus.upcoming,
    note: 'Chuyến đi đêm Hà Nội - Nha Trang',
    createdAt: new Date('2024-06-11T22:00:00Z'),
    updatedAt: new Date('2024-06-11T22:00:00Z'),
  },
  {
    tripId: 5,
    vehicleId: 5,
    driverId: 2,
    status: TripStatus.delayed,
    note: 'Chuyến bị delay do thời tiết',
    createdAt: new Date('2024-06-10T16:00:00Z'),
    updatedAt: new Date('2024-06-10T17:30:00Z'),
  },
]

export const mockTripStops: TripStops[] = [
  // Trip 1: Hà Nội -> TP.HCM
  {
    tripStopId: 1,
    tripId: 1,
    locationId: 1,
    stopOrder: 1,
    arrivalTime: new Date('2024-06-10T08:00:00Z'),
    departureTime: new Date('2024-06-10T08:30:00Z'),
    isPickup: true,
  },
  {
    tripStopId: 2,
    tripId: 1,
    locationId: 2,
    stopOrder: 2,
    arrivalTime: new Date('2024-06-10T16:00:00Z'),
    departureTime: new Date('2024-06-10T16:30:00Z'),
    isPickup: false,
  },

  // Trip 2: Đà Nẵng -> Hải Phòng
  {
    tripStopId: 3,
    tripId: 2,
    locationId: 3,
    stopOrder: 1,
    arrivalTime: new Date('2024-06-10T14:00:00Z'),
    departureTime: new Date('2024-06-10T14:30:00Z'),
    isPickup: true,
  },
  {
    tripStopId: 4,
    tripId: 2,
    locationId: 4,
    stopOrder: 2,
    arrivalTime: new Date('2024-06-10T18:00:00Z'),
    departureTime: new Date('2024-06-10T18:30:00Z'),
    isPickup: false,
  },

  // Trip 3: Cần Thơ -> TP.HCM
  {
    tripStopId: 5,
    tripId: 3,
    locationId: 5,
    stopOrder: 1,
    arrivalTime: new Date('2024-06-09T20:00:00Z'),
    departureTime: new Date('2024-06-09T20:30:00Z'),
    isPickup: true,
  },
  {
    tripStopId: 6,
    tripId: 3,
    locationId: 2,
    stopOrder: 2,
    arrivalTime: new Date('2024-06-10T02:00:00Z'),
    departureTime: new Date('2024-06-10T02:30:00Z'),
    isPickup: false,
  },

  // Trip 4: Hà Nội -> Nha Trang (có dừng trung gian)
  {
    tripStopId: 7,
    tripId: 4,
    locationId: 1,
    stopOrder: 1,
    arrivalTime: new Date('2024-06-11T22:00:00Z'),
    departureTime: new Date('2024-06-11T22:30:00Z'),
    isPickup: true,
  },
  {
    tripStopId: 8,
    tripId: 4,
    locationId: 7,
    stopOrder: 2,
    arrivalTime: new Date('2024-06-12T06:00:00Z'),
    departureTime: new Date('2024-06-12T06:30:00Z'),
    isPickup: false,
  },
  {
    tripStopId: 9,
    tripId: 4,
    locationId: 6,
    stopOrder: 3,
    arrivalTime: new Date('2024-06-12T14:00:00Z'),
    departureTime: new Date('2024-06-12T14:30:00Z'),
    isPickup: false,
  },
]

export const mockTickets: Tickets[] = [
  {
    ticketId: 1,
    userId: 3,
    tripId: 1,
    pickupStopId: 1,
    dropoffStopId: 2,
    seatNumber: 'L1',
    price: 250000,
    status: TicketStatus.booked,
    createdAt: new Date('2024-06-09T10:00:00Z'),
    updatedAt: new Date('2024-06-09T10:00:00Z'),
  },
  {
    ticketId: 2,
    userId: 4,
    tripId: 1,
    pickupStopId: 1,
    dropoffStopId: 2,
    seatNumber: 'L2',
    price: 250000,
    status: TicketStatus.booked,
    createdAt: new Date('2024-06-09T11:00:00Z'),
    updatedAt: new Date('2024-06-09T11:00:00Z'),
  },
  {
    ticketId: 3,
    userId: 5,
    tripId: 2,
    pickupStopId: 3,
    dropoffStopId: 4,
    seatNumber: 'B1',
    price: 180000,
    status: TicketStatus.booked,
    createdAt: new Date('2024-06-09T12:00:00Z'),
    updatedAt: new Date('2024-06-09T12:00:00Z'),
  },
  {
    ticketId: 4,
    userId: 3,
    tripId: 3,
    pickupStopId: 5,
    dropoffStopId: 6,
    seatNumber: 'S1',
    price: 150000,
    status: TicketStatus.completed,
    createdAt: new Date('2024-06-08T15:00:00Z'),
    updatedAt: new Date('2024-06-10T06:00:00Z'),
  },
  {
    ticketId: 5,
    userId: 4,
    tripId: 4,
    pickupStopId: 7,
    dropoffStopId: 9,
    seatNumber: 'L3',
    price: 350000,
    status: TicketStatus.cancelled,
    createdAt: new Date('2024-06-10T09:00:00Z'),
    updatedAt: new Date('2024-06-10T10:00:00Z'),
  },
]

export const mockPayments: Payments[] = [
  {
    paymentId: 1,
    ticketId: 1,
    amount: 250000,
    method: PaymentMethod.momo,
    paidAt: new Date('2024-06-09T10:05:00Z'),
    createdAt: new Date('2024-06-09T10:05:00Z'),
    updatedAt: new Date('2024-06-09T10:05:00Z'),
  },
  {
    paymentId: 2,
    ticketId: 2,
    amount: 250000,
    method: PaymentMethod.banking,
    paidAt: new Date('2024-06-09T11:10:00Z'),
    createdAt: new Date('2024-06-09T11:10:00Z'),
    updatedAt: new Date('2024-06-09T11:10:00Z'),
  },
  {
    paymentId: 3,
    ticketId: 3,
    amount: 180000,
    method: PaymentMethod.card,
    paidAt: new Date('2024-06-09T12:15:00Z'),
    createdAt: new Date('2024-06-09T12:15:00Z'),
    updatedAt: new Date('2024-06-09T12:15:00Z'),
  },
  {
    paymentId: 4,
    ticketId: 4,
    amount: 150000,
    method: PaymentMethod.cash,
    paidAt: new Date('2024-06-08T15:30:00Z'),
    createdAt: new Date('2024-06-08T15:30:00Z'),
    updatedAt: new Date('2024-06-08T15:30:00Z'),
  },
]

export const mockTripSeats: TripSeats[] = [
  // Trip 1 - Limousine 22 chỗ
  ...Array.from({ length: 22 }, (_, i) => ({
    tripId: 1,
    seatNumber: `L${i + 1}`,
    isBooked: i < 2, // 2 ghế đầu đã được đặt
    ticketId: i === 0 ? 1 : i === 1 ? 2 : undefined,
  })),

  // Trip 2 - Giường nằm 40 chỗ
  ...Array.from({ length: 40 }, (_, i) => ({
    tripId: 2,
    seatNumber: `B${i + 1}`,
    isBooked: i === 0, // 1 ghế đầu đã được đặt
    ticketId: i === 0 ? 3 : undefined,
  })),

  // Trip 3 - Ghế ngồi 45 chỗ
  ...Array.from({ length: 45 }, (_, i) => ({
    tripId: 3,
    seatNumber: `S${i + 1}`,
    isBooked: i === 0, // 1 ghế đầu đã được đặt
    ticketId: i === 0 ? 4 : undefined,
  })),

  // Trip 4 - Limousine 22 chỗ
  ...Array.from({ length: 22 }, (_, i) => ({
    tripId: 4,
    seatNumber: `L${i + 1}`,
    isBooked: false, // Chuyến bị hủy nên không có ghế nào được đặt
    ticketId: undefined,
  })),
]

export const mockNotifications: Notifications[] = [
  {
    notificationId: 1,
    ticketId: 1,
    userId: 3,
    type: NotificationType.email,
    message: 'Xác nhận đặt vé thành công. Chuyến đi Hà Nội - TP.HCM vào 10/06/2024 lúc 08:00.',
    sentAt: new Date('2024-06-09T10:05:00Z'),
    status: NotificationStatus.sent,
    createdAt: new Date('2024-06-09T10:05:00Z'),
  },
  {
    notificationId: 2,
    ticketId: 1,
    userId: 3,
    type: NotificationType.phone,
    message: 'Nhắc nhở: Chuyến đi của bạn sẽ khởi hành trong 2 giờ nữa.',
    sentAt: new Date('2024-06-10T06:00:00Z'),
    status: NotificationStatus.sent,
    createdAt: new Date('2024-06-10T06:00:00Z'),
  },
  {
    notificationId: 3,
    ticketId: 2,
    userId: 4,
    type: NotificationType.email,
    message: 'Xác nhận đặt vé thành công. Chuyến đi Hà Nội - TP.HCM vào 10/06/2024 lúc 08:00.',
    sentAt: new Date('2024-06-09T11:10:00Z'),
    status: NotificationStatus.sent,
    createdAt: new Date('2024-06-09T11:10:00Z'),
  },
  {
    notificationId: 4,
    ticketId: 5,
    userId: 4,
    type: NotificationType.email,
    message:
      'Thông báo hủy vé: Vé của bạn đã được hủy thành công. Tiền sẽ được hoàn lại trong 3-5 ngày làm việc.',
    sentAt: new Date('2024-06-10T10:00:00Z'),
    status: NotificationStatus.sent,
    createdAt: new Date('2024-06-10T10:00:00Z'),
  },
  {
    notificationId: 5,
    ticketId: 3,
    userId: 5,
    type: NotificationType.phone,
    message: 'Chuyến đi Đà Nẵng - Hải Phòng đang trễ giờ 30 phút do tắc đường.',
    sentAt: new Date('2024-06-10T14:30:00Z'),
    status: NotificationStatus.pending,
    createdAt: new Date('2024-06-10T14:30:00Z'),
  },
]

// Utility functions for working with mock data
export const getMockDataByTripId = (tripId: number) => {
  const trip = mockTrips.find((t) => t.tripId === tripId)
  const tripStops = mockTripStops.filter((ts) => ts.tripId === tripId)
  const tickets = mockTickets.filter((t) => t.tripId === tripId)
  const tripSeats = mockTripSeats.filter((ts) => ts.tripId === tripId)

  return {
    trip,
    tripStops,
    tickets,
    tripSeats,
  }
}

export const getMockDataByUserId = (userId: number) => {
  const user = mockUsers.find((u) => u.userId === userId)
  const tickets = mockTickets.filter((t) => t.userId === userId)
  const notifications = mockNotifications.filter((n) => n.userId === userId)

  return {
    user,
    tickets,
    notifications,
  }
}

// Summary statistics
export const mockDataSummary = {
  totalUsers: mockUsers.length,
  totalVehicleTypes: mockVehicleTypes.length,
  totalSeatConfigurations: mockSeatConfigurations.length,
  totalVehicles: mockVehicles.length,
  totalLocations: mockLocations.length,
  totalTrips: mockTrips.length,
  totalTripStops: mockTripStops.length,
  totalTickets: mockTickets.length,
  totalPayments: mockPayments.length,
  totalTripSeats: mockTripSeats.length,
  totalNotifications: mockNotifications.length,
}
