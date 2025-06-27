import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum'
import { ApiResponse, PaginatedResponse } from '@/shared/types/response'
import { httpClient } from '@/configs/http-client/HttpClient'

// Types
export interface SeatConfiguration {
  seatConfigId: number
  vehicleTypeId: number
  seatNumber: string
  rowNumber: number
  columnNumber: number
  isAvailable: boolean
  vehicleType?: {
    vehicleTypeId: number
    name: string
    seatCapacity: number
    pricePerSeat: number
  }
}

export interface TripSeat {
  tripId: number
  seatNumber: string
  isBooked: boolean
  ticketId?: number
  trip?: {
    tripId: number
    vehicle: {
      vehicleType: {
        vehicleTypeId: number
        name: string
        seatCapacity: number
        pricePerSeat: number
      }
    }
  }
  ticket?: {
    ticketId: number
    user: {
      userId: number
      name: string
      phone: string
    }
  }
}

export interface VehicleType {
  vehicleTypeId: number
  name: string
  seatCapacity: number
  pricePerSeat: number
}

export interface SeatAvailabilityResponse {
  seats: (SeatConfiguration | TripSeat)[]
  statistics: {
    total: number
    available: number
    unavailable: number
    availabilityRate: string
  }
}

export interface CreateSeatConfigurationRequest {
  vehicleTypeId: number
  seatNumber: string
  rowNumber: number
  columnNumber: number
  isAvailable?: boolean
}

export interface UpdateSeatConfigurationRequest {
  seatNumber?: string
  rowNumber?: number
  columnNumber?: number
  isAvailable?: boolean
}

export interface BulkCreateSeatConfigurationRequest {
  vehicleTypeId: number
  seatConfigurations: Array<{
    seatNumber: string
    rowNumber: number
    columnNumber: number
    isAvailable?: boolean
  }>
}

export interface BulkUpdateSeatConfigurationRequest {
  updates: Array<{
    seatConfigId: number
    seatNumber?: string
    rowNumber?: number
    columnNumber?: number
    isAvailable?: boolean
  }>
}

export interface BulkDeleteSeatConfigurationRequest {
  seatConfigIds: number[]
}

export interface UpdateSeatAvailabilityRequest {
  seatConfigId: number
  isAvailable: boolean
}

export interface BulkUpdateSeatAvailabilityRequest {
  vehicleTypeId: number
  isAvailable: boolean
  seatNumbers?: string[]
}

export interface CreateTripSeatsRequest {
  tripId: number
  seatConfigurations: Array<{
    seatNumber: string
  }>
}

export interface UpdateTripSeatRequest {
  tripId: number
  seatNumber: string
  isBooked?: boolean
  ticketId?: number
}

export class SeatApi {
  private httpClient = httpClient

  constructor() {
    // Constructor is now empty since we use the singleton instance
  }

  // Seat Configuration APIs
  async getSeatConfigurations(params?: {
    vehicleTypeId?: number
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<SeatConfiguration>> {
    const queryParams = new URLSearchParams()
    if (params?.vehicleTypeId) queryParams.append('vehicleTypeId', params.vehicleTypeId.toString())
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const url = `${ApiEndpointEnum.SEAT_CONFIGURATIONS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return this.httpClient.get<PaginatedResponse<SeatConfiguration>>(url)
  }

  async getSeatConfiguration(seatConfigId: number): Promise<ApiResponse<SeatConfiguration>> {
    const url = ApiEndpointEnum.SEAT_CONFIGURATION_BY_ID.replace('[id]', seatConfigId.toString())
    return this.httpClient.get<ApiResponse<SeatConfiguration>>(url)
  }

  async createSeatConfiguration(
    data: CreateSeatConfigurationRequest,
  ): Promise<ApiResponse<SeatConfiguration>> {
    return this.httpClient.post<ApiResponse<SeatConfiguration>>(
      ApiEndpointEnum.SEAT_CONFIGURATIONS,
      data,
    )
  }

  async updateSeatConfiguration(
    seatConfigId: number,
    data: UpdateSeatConfigurationRequest,
  ): Promise<ApiResponse<SeatConfiguration>> {
    const url = ApiEndpointEnum.SEAT_CONFIGURATION_BY_ID.replace('[id]', seatConfigId.toString())
    return this.httpClient.put<ApiResponse<SeatConfiguration>>(url, data)
  }

  async deleteSeatConfiguration(seatConfigId: number): Promise<ApiResponse<void>> {
    const url = ApiEndpointEnum.SEAT_CONFIGURATION_BY_ID.replace('[id]', seatConfigId.toString())
    return this.httpClient.delete<ApiResponse<void>>(url)
  }

  // Bulk Operations
  async bulkCreateSeatConfigurations(data: BulkCreateSeatConfigurationRequest): Promise<
    ApiResponse<{
      created: number
      seatConfigurations: SeatConfiguration[]
    }>
  > {
    return this.httpClient.post<
      ApiResponse<{
        created: number
        seatConfigurations: SeatConfiguration[]
      }>
    >(ApiEndpointEnum.SEAT_CONFIGURATIONS_BULK, data)
  }

  async bulkUpdateSeatConfigurations(data: BulkUpdateSeatConfigurationRequest): Promise<
    ApiResponse<{
      updated: number
      failed: number
      results: SeatConfiguration[]
      errors: Array<{ seatConfigId: number; error: string }>
    }>
  > {
    return this.httpClient.put<
      ApiResponse<{
        updated: number
        failed: number
        results: SeatConfiguration[]
        errors: Array<{ seatConfigId: number; error: string }>
      }>
    >(ApiEndpointEnum.SEAT_CONFIGURATIONS_BULK, data)
  }

  async bulkDeleteSeatConfigurations(data: BulkDeleteSeatConfigurationRequest): Promise<
    ApiResponse<{
      deleted: number
      failed: number
      results: Array<{ seatConfigId: number; status: string }>
      errors: Array<{ seatConfigId: number; error: string }>
    }>
  > {
    return this.httpClient.post<
      ApiResponse<{
        deleted: number
        failed: number
        results: Array<{ seatConfigId: number; status: string }>
        errors: Array<{ seatConfigId: number; error: string }>
      }>
    >(ApiEndpointEnum.SEAT_CONFIGURATIONS_BULK, data)
  }

  // Seat Availability APIs
  async getSeatAvailability(params: {
    vehicleTypeId?: number
    tripId?: number
    isAvailable?: boolean
  }): Promise<ApiResponse<SeatAvailabilityResponse>> {
    const queryParams = new URLSearchParams()
    if (params.vehicleTypeId) queryParams.append('vehicleTypeId', params.vehicleTypeId.toString())
    if (params.tripId) queryParams.append('tripId', params.tripId.toString())
    if (params.isAvailable !== undefined)
      queryParams.append('isAvailable', params.isAvailable.toString())

    const url = `${ApiEndpointEnum.SEAT_CONFIGURATIONS_AVAILABILITY}?${queryParams.toString()}`
    return this.httpClient.get<ApiResponse<SeatAvailabilityResponse>>(url)
  }

  async updateSeatAvailability(
    data: UpdateSeatAvailabilityRequest,
  ): Promise<ApiResponse<SeatConfiguration>> {
    return this.httpClient.put<ApiResponse<SeatConfiguration>>(
      ApiEndpointEnum.SEAT_CONFIGURATIONS_AVAILABILITY,
      data,
    )
  }

  async bulkUpdateSeatAvailability(data: BulkUpdateSeatAvailabilityRequest): Promise<
    ApiResponse<{
      updated: number
      seatConfigurations: SeatConfiguration[]
    }>
  > {
    return this.httpClient.post<
      ApiResponse<{
        updated: number
        seatConfigurations: SeatConfiguration[]
      }>
    >(ApiEndpointEnum.SEAT_CONFIGURATIONS_AVAILABILITY, data)
  }

  // Trip Seats APIs
  async getTripSeats(params?: {
    tripId?: number
    seatNumber?: string
    isBooked?: boolean
  }): Promise<ApiResponse<TripSeat[]>> {
    const queryParams = new URLSearchParams()
    if (params?.tripId) queryParams.append('tripId', params.tripId.toString())
    if (params?.seatNumber) queryParams.append('seatNumber', params.seatNumber)
    if (params?.isBooked !== undefined) queryParams.append('isBooked', params.isBooked.toString())

    const url = `${ApiEndpointEnum.TRIP_SEATS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return this.httpClient.get<ApiResponse<TripSeat[]>>(url)
  }

  async createTripSeats(data: CreateTripSeatsRequest): Promise<
    ApiResponse<{
      created: number
      tripSeats: TripSeat[]
    }>
  > {
    return this.httpClient.post<
      ApiResponse<{
        created: number
        tripSeats: TripSeat[]
      }>
    >(ApiEndpointEnum.TRIP_SEATS, data)
  }

  async updateTripSeat(data: UpdateTripSeatRequest): Promise<ApiResponse<TripSeat>> {
    return this.httpClient.put<ApiResponse<TripSeat>>(ApiEndpointEnum.TRIP_SEATS, data)
  }

  // Vehicle Types API
  async getVehicleTypes(): Promise<ApiResponse<VehicleType[]>> {
    return this.httpClient.get<ApiResponse<VehicleType[]>>(ApiEndpointEnum.VEHICLE_TYPES)
  }
}
