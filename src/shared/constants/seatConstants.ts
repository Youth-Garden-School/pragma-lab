// Seat Status Constants
export const SEAT_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  MAINTENANCE: 'maintenance',
} as const

export type SeatStatus = (typeof SEAT_STATUS)[keyof typeof SEAT_STATUS]

// Vehicle Type Layout Constants
export const VEHICLE_TYPE_LAYOUTS = {
  LIMOUSINE_22: {
    id: 1,
    name: 'Xe Limousine 22 chỗ',
    gridColumns: 'grid-cols-3',
    seatCapacity: 22,
    seatPrefix: 'L',
  },
  SLEEPER_40: {
    id: 2,
    name: 'Xe Giường nằm 40 chỗ',
    gridColumns: 'grid-cols-2',
    seatCapacity: 40,
    seatPrefix: 'B',
  },
  SEATED_45: {
    id: 3,
    name: 'Xe Ghế ngồi 45 chỗ',
    gridColumns: 'grid-cols-5',
    seatCapacity: 45,
    seatPrefix: 'S',
  },
} as const

// Badge Variant Mapping
export const SEAT_STATUS_BADGE_VARIANTS = {
  [SEAT_STATUS.AVAILABLE]: 'default',
  [SEAT_STATUS.BOOKED]: 'destructive',
  [SEAT_STATUS.MAINTENANCE]: 'secondary',
} as const

// Badge Text Mapping
export const SEAT_STATUS_BADGE_TEXT = {
  [SEAT_STATUS.AVAILABLE]: 'Available',
  [SEAT_STATUS.BOOKED]: 'Booked',
  [SEAT_STATUS.MAINTENANCE]: 'Maintenance',
} as const

// Seat Configuration Defaults
export const SEAT_CONFIG_DEFAULTS = {
  DEFAULT_AVAILABILITY: true,
  DEFAULT_ROW_COLUMNS: {
    LIMOUSINE: { rows: 8, columns: 3 }, // 24 seats (22 + 2 for driver area)
    SLEEPER: { rows: 20, columns: 2 }, // 40 seats
    SEATED: { rows: 9, columns: 5 }, // 45 seats
  },
} as const

// API Error Messages
export const SEAT_API_ERRORS = {
  SEAT_NOT_FOUND: 'Seat configuration not found',
  SEAT_ALREADY_EXISTS: 'Seat number already exists for this vehicle type',
  SEAT_IN_USE: 'Cannot delete seat configuration that is being used in trips',
  SEAT_BOOKED: 'Cannot set seat as unavailable while it is booked in active trips',
  INVALID_VEHICLE_TYPE: 'Invalid vehicle type',
  MISSING_REQUIRED_FIELDS: 'Missing required fields',
} as const

// Validation Rules
export const SEAT_VALIDATION_RULES = {
  SEAT_NUMBER_MAX_LENGTH: 10,
  ROW_NUMBER_MAX: 50,
  COLUMN_NUMBER_MAX: 10,
  VEHICLE_TYPE_ID_MIN: 1,
} as const
