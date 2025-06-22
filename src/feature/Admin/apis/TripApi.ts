import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum'
import { ApiResponse, PaginatedData } from '@/shared/types/response'
import { httpClient } from '@/configs/http-client/HttpClient'

// Types
export interface Trip {
  tripId: number
  vehicleId: number
  driverId: number
  status: TripStatus
  note?: string
  createdAt: Date
  updatedAt: Date
  vehicle?: {
    vehicleId: number
    licensePlate: string
    vehicleType: {
      vehicleTypeId: number
      name: string
      seatCapacity: number
      pricePerSeat: number
    }
  }
  driver?: {
    userId: number
    name: string
    phone: string
  }
  tripStops?: TripStop[]
  tickets?: Ticket[]
  tripSeats?: TripSeat[]
  _count?: {
    tickets: number
    tripSeats: number
  }
}

export interface TripStop {
  tripStopId: number
  tripId: number
  locationId: number
  stopOrder: number
  arrivalTime: Date
  departureTime: Date
  isPickup: boolean
  location?: {
    locationId: number
    detail: string
    province: string
  }
}

export interface Ticket {
  ticketId: number
  userId: number
  tripId: number
  pickupStopId: number
  dropoffStopId: number
  seatNumber: string
  price: number
  status: TicketStatus
  createdAt: Date
  updatedAt: Date
  user?: {
    userId: number
    name: string
    phone: string
  }
}

export interface TripSeat {
  tripId: number
  seatNumber: string
  isBooked: boolean
  ticketId?: number
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

export interface CreateTripRequest {
  vehicleId: number
  driverId: number
  note?: string
  tripStops: Array<{
    locationId: number
    arrivalTime: string
    departureTime: string
    isPickup: boolean
  }>
}

export interface UpdateTripRequest {
  vehicleId?: number
  driverId?: number
  status?: TripStatus
  note?: string
  tripStops?: Array<{
    locationId: number
    arrivalTime: string
    departureTime: string
    isPickup: boolean
  }>
}

export interface GetTripsParams {
  page?: number
  limit?: number
  status?: TripStatus
  vehicleId?: number
  driverId?: number
  search?: string
}

export class TripApi {
  private httpClient = httpClient

  // Get all trips with pagination and filters
  async getTrips(params?: GetTripsParams): Promise<ApiResponse<PaginatedData<Trip>>> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.status) queryParams.append('status', params.status)
    if (params?.vehicleId) queryParams.append('vehicleId', params.vehicleId.toString())
    if (params?.driverId) queryParams.append('driverId', params.driverId.toString())
    if (params?.search) queryParams.append('search', params.search)

    const url = `${ApiEndpointEnum.TRIPS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return this.httpClient.get<ApiResponse<PaginatedData<Trip>>>(url)
  }

  // Get trip by ID
  async getTripById(tripId: number): Promise<ApiResponse<Trip>> {
    const url = `${ApiEndpointEnum.TRIPS}/${tripId}`
    return this.httpClient.get<ApiResponse<Trip>>(url)
  }

  // Create new trip
  async createTrip(data: CreateTripRequest): Promise<ApiResponse<Trip>> {
    return this.httpClient.post<ApiResponse<Trip>>(ApiEndpointEnum.TRIPS, data)
  }

  // Update trip
  async updateTrip(tripId: number, data: UpdateTripRequest): Promise<ApiResponse<Trip>> {
    const url = `${ApiEndpointEnum.TRIPS}/${tripId}`
    return this.httpClient.put<ApiResponse<Trip>>(url, data)
  }

  // Delete trip
  async deleteTrip(tripId: number): Promise<ApiResponse<void>> {
    const url = `${ApiEndpointEnum.TRIPS}/${tripId}`
    return this.httpClient.delete<ApiResponse<void>>(url)
  }

  // Get trips by status
  async getTripsByStatus(status: TripStatus): Promise<ApiResponse<PaginatedData<Trip>>> {
    return this.getTrips({ status })
  }

  // Get active trips (upcoming and ongoing)
  async getActiveTrips(): Promise<ApiResponse<PaginatedData<Trip>>> {
    // Just get all trips without status filter for now
    return this.getTrips({ limit: 50 })
  }

  // Get trips by vehicle
  async getTripsByVehicle(vehicleId: number): Promise<ApiResponse<PaginatedData<Trip>>> {
    return this.getTrips({ vehicleId })
  }

  // Get trips by driver
  async getTripsByDriver(driverId: number): Promise<ApiResponse<PaginatedData<Trip>>> {
    return this.getTrips({ driverId })
  }
}
