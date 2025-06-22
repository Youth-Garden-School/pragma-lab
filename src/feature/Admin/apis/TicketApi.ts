import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum'
import { ApiResponse, PaginatedResponse } from '@/shared/types/response'
import { httpClient } from '@/configs/http-client/HttpClient'

// Types
export interface Ticket {
  ticketId: number
  userId: number
  tripId: number
  pickupStopId: number
  dropoffStopId: number
  seatNumber: string
  price: number
  status: TicketStatus
  createdAt: string
  updatedAt: string
  user?: {
    userId: number
    name: string
    email: string
    phone: string
    dateOfBirth?: string
    address?: string
  }
  trip?: {
    tripId: number
    vehicleId: number
    driverId: number
    status: string
    note?: string
    createdAt: string
    updatedAt: string
    vehicle?: {
      vehicleId: number
      licensePlate: string
      vehicleTypeId: number
      vehicleType?: {
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
      email: string
    }
    tripStops?: TripStop[]
  }
  pickupStop?: TripStop
  dropoffStop?: TripStop
  payments?: Payment[]
  tripSeats?: TripSeat[]
}

export interface TripStop {
  tripStopId: number
  tripId: number
  locationId: number
  stopOrder: number
  arrivalTime: string
  departureTime: string
  isPickup: boolean
  location?: {
    locationId: number
    detail: string
    province: string
  }
}

export interface Payment {
  paymentId: number
  ticketId: number
  amount: number
  method: PaymentMethod
  paidAt: string
  createdAt: string
  updatedAt: string
}

export interface TripSeat {
  tripId: number
  seatNumber: string
  isBooked: boolean
  ticketId?: number
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

export interface CreateTicketRequest {
  userId: number
  tripId: number
  pickupStopId: number
  dropoffStopId: number
  seatNumber: string
  price: number
}

export interface UpdateTicketRequest {
  status?: TicketStatus
  seatNumber?: string
}

export interface GetTicketsParams {
  page?: number
  limit?: number
  status?: TicketStatus | 'all'
  search?: string
}

export class TicketApi {
  private httpClient = httpClient

  constructor() {
    // Constructor is now empty since we use the singleton instance
  }

  // Get all tickets with pagination and filters
  async getTickets(params?: GetTicketsParams): Promise<PaginatedResponse<Ticket>> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.status && params.status !== 'all') queryParams.append('status', params.status)
    if (params?.search) queryParams.append('search', params.search)

    const url = `${ApiEndpointEnum.TICKETS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return this.httpClient.get<PaginatedResponse<Ticket>>(url)
  }

  // Get ticket by ID
  async getTicketById(ticketId: number): Promise<ApiResponse<Ticket>> {
    const url = ApiEndpointEnum.TICKET_BY_ID.replace('[id]', ticketId.toString())
    return this.httpClient.get<ApiResponse<Ticket>>(url)
  }

  // Create new ticket
  async createTicket(data: CreateTicketRequest): Promise<ApiResponse<Ticket>> {
    return this.httpClient.post<ApiResponse<Ticket>>(ApiEndpointEnum.TICKETS, data)
  }

  // Update ticket
  async updateTicket(ticketId: number, data: UpdateTicketRequest): Promise<ApiResponse<Ticket>> {
    const url = ApiEndpointEnum.TICKET_BY_ID.replace('[id]', ticketId.toString())
    return this.httpClient.put<ApiResponse<Ticket>>(url, data)
  }

  // Cancel ticket (soft delete)
  async cancelTicket(ticketId: number): Promise<ApiResponse<void>> {
    const url = ApiEndpointEnum.TICKET_BY_ID.replace('[id]', ticketId.toString())
    return this.httpClient.delete<ApiResponse<void>>(url)
  }

  // Get ticket statistics
  async getTicketStatistics(): Promise<
    ApiResponse<{
      total: number
      booked: number
      completed: number
      cancelled: number
      refunded: number
      totalRevenue: number
    }>
  > {
    const url = `${ApiEndpointEnum.TICKETS}/statistics`
    return this.httpClient.get<
      ApiResponse<{
        total: number
        booked: number
        completed: number
        cancelled: number
        refunded: number
        totalRevenue: number
      }>
    >(url)
  }
}
