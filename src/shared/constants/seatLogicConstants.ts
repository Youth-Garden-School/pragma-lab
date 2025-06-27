// Seat Logic Validation Constants
export const SEAT_LOGIC_CONSTANTS = {
  // Validation Rules
  VALIDATION: {
    MIN_SEAT_NUMBER_LENGTH: 1,
    MAX_SEAT_NUMBER_LENGTH: 10,
    MIN_ROW_NUMBER: 1,
    MAX_ROW_NUMBER: 50,
    MIN_COLUMN_NUMBER: 1,
    MAX_COLUMN_NUMBER: 10,
    MIN_VEHICLE_TYPE_ID: 1,
  },

  // Business Logic Rules
  BUSINESS_RULES: {
    // Seat cannot be set unavailable if booked in active trips
    CANNOT_SET_UNAVAILABLE_IF_BOOKED: true,
    // Seat number must be unique per vehicle type
    SEAT_NUMBER_UNIQUE_PER_VEHICLE_TYPE: true,
    // Cannot delete seat configuration if used in trips
    CANNOT_DELETE_IF_USED_IN_TRIPS: true,
    // Trip seats are created from seat configurations
    TRIP_SEATS_FROM_CONFIGURATIONS: true,
  },

  // Trip Status for Active Trips
  ACTIVE_TRIP_STATUSES: ['upcoming', 'ongoing'] as const,

  // Default Values
  DEFAULTS: {
    SEAT_AVAILABILITY: true,
    TRIP_SEAT_BOOKED: false,
    SEAT_CONFIG_AVAILABLE: true,
  },

  // Error Messages
  ERROR_MESSAGES: {
    SEAT_CONFIG_NOT_FOUND: 'Seat configuration not found',
    SEAT_NUMBER_ALREADY_EXISTS: 'Seat number already exists for this vehicle type',
    SEAT_IN_USE_CANNOT_DELETE: 'Cannot delete seat configuration that is being used in trips',
    SEAT_BOOKED_CANNOT_SET_UNAVAILABLE:
      'Cannot set seat as unavailable while it is booked in active trips',
    VEHICLE_TYPE_NOT_FOUND: 'Vehicle type not found',
    TRIP_NOT_FOUND: 'Trip not found',
    MISSING_REQUIRED_FIELDS: 'Missing required fields',
    INVALID_SEAT_CONFIGURATION: 'Invalid seat configuration',
    DUPLICATE_SEAT_NUMBERS: 'Duplicate seat numbers found',
  },

  // Success Messages
  SUCCESS_MESSAGES: {
    SEAT_CONFIG_CREATED: 'Seat configuration created successfully',
    SEAT_CONFIG_UPDATED: 'Seat configuration updated successfully',
    SEAT_CONFIG_DELETED: 'Seat configuration deleted successfully',
    SEAT_AVAILABILITY_UPDATED: 'Seat availability updated successfully',
    BULK_OPERATION_COMPLETED: 'Bulk operation completed successfully',
    TRIP_SEATS_CREATED: 'Trip seats created successfully',
    TRIP_SEAT_UPDATED: 'Trip seat updated successfully',
  },

  // API Response Codes
  RESPONSE_CODES: {
    SUCCESS: 'SUCCESS',
    BAD_REQUEST: 'BAD_REQUEST',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  },

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    CONFLICT: 409,
    METHOD_NOT_ALLOWED: 405,
    INTERNAL_SERVER_ERROR: 500,
  },
} as const

// Type definitions for better type safety
export type ActiveTripStatus = (typeof SEAT_LOGIC_CONSTANTS.ACTIVE_TRIP_STATUSES)[number]
export type ResponseCode =
  (typeof SEAT_LOGIC_CONSTANTS.RESPONSE_CODES)[keyof typeof SEAT_LOGIC_CONSTANTS.RESPONSE_CODES]

// Validation functions
export const validateSeatNumber = (seatNumber: string): boolean => {
  const { MIN_SEAT_NUMBER_LENGTH, MAX_SEAT_NUMBER_LENGTH } = SEAT_LOGIC_CONSTANTS.VALIDATION
  return seatNumber.length >= MIN_SEAT_NUMBER_LENGTH && seatNumber.length <= MAX_SEAT_NUMBER_LENGTH
}

export const validateRowNumber = (rowNumber: number): boolean => {
  const { MIN_ROW_NUMBER, MAX_ROW_NUMBER } = SEAT_LOGIC_CONSTANTS.VALIDATION
  return rowNumber >= MIN_ROW_NUMBER && rowNumber <= MAX_ROW_NUMBER
}

export const validateColumnNumber = (columnNumber: number): boolean => {
  const { MIN_COLUMN_NUMBER, MAX_COLUMN_NUMBER } = SEAT_LOGIC_CONSTANTS.VALIDATION
  return columnNumber >= MIN_COLUMN_NUMBER && columnNumber <= MAX_COLUMN_NUMBER
}

export const validateVehicleTypeId = (vehicleTypeId: number): boolean => {
  const { MIN_VEHICLE_TYPE_ID } = SEAT_LOGIC_CONSTANTS.VALIDATION
  return vehicleTypeId >= MIN_VEHICLE_TYPE_ID
}

export const isActiveTripStatus = (status: string): status is ActiveTripStatus => {
  return SEAT_LOGIC_CONSTANTS.ACTIVE_TRIP_STATUSES.includes(status as ActiveTripStatus)
}
