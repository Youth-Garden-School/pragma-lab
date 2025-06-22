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
    layout: { rows: 8, columns: 3 },
    driverArea: { rows: 1, columns: 1 }, // Driver takes 1 seat
  },
  SLEEPER_40: {
    id: 2,
    name: 'Xe Giường nằm 40 chỗ',
    gridColumns: 'grid-cols-2',
    seatCapacity: 40,
    seatPrefix: 'B',
    layout: { rows: 20, columns: 2 },
    driverArea: { rows: 1, columns: 1 },
  },
  SEATED_45: {
    id: 3,
    name: 'Xe Ghế ngồi 45 chỗ',
    gridColumns: 'grid-cols-5',
    seatCapacity: 45,
    seatPrefix: 'S',
    layout: { rows: 9, columns: 5 },
    driverArea: { rows: 1, columns: 1 },
  },
} as const

// Auto-Generation Layout Templates
export const SEAT_LAYOUT_TEMPLATES = {
  // Standard bus layout (4 columns)
  STANDARD_BUS: {
    columns: 4,
    seatNumberFormat: (row: number, col: number) => `${String.fromCharCode(64 + row)}${col}`,
    description: 'Standard bus layout with 4 columns'
  },
  // Limousine layout (3 columns)
  LIMOUSINE: {
    columns: 3,
    seatNumberFormat: (row: number, col: number) => `L${row}${col}`,
    description: 'Limousine layout with 3 columns'
  },
  // Sleeper bus layout (2 columns)
  SLEEPER: {
    columns: 2,
    seatNumberFormat: (row: number, col: number) => `B${row}${col}`,
    description: 'Sleeper bus layout with 2 columns'
  },
  // Large bus layout (5 columns)
  LARGE_BUS: {
    columns: 5,
    seatNumberFormat: (row: number, col: number) => `${String.fromCharCode(64 + row)}${col}`,
    description: 'Large bus layout with 5 columns'
  }
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
  // Auto-generation settings
  AUTO_GENERATION: {
    DEFAULT_TEMPLATE: 'STANDARD_BUS',
    MIN_CAPACITY: 1,
    MAX_CAPACITY: 100,
    DEFAULT_COLUMNS: 4,
  }
} as const

// API Error Messages
export const SEAT_API_ERRORS = {
  SEAT_NOT_FOUND: 'Seat configuration not found',
  SEAT_ALREADY_EXISTS: 'Seat number already exists for this vehicle type',
  SEAT_IN_USE: 'Cannot delete seat configuration that is being used in trips',
  SEAT_BOOKED: 'Cannot set seat as unavailable while it is booked in active trips',
  INVALID_VEHICLE_TYPE: 'Invalid vehicle type',
  MISSING_REQUIRED_FIELDS: 'Missing required fields',
  INVALID_CAPACITY: 'Invalid seat capacity',
  LAYOUT_GENERATION_FAILED: 'Failed to generate seat layout',
} as const

// Validation Rules
export const SEAT_VALIDATION_RULES = {
  SEAT_NUMBER_MAX_LENGTH: 10,
  ROW_NUMBER_MAX: 50,
  COLUMN_NUMBER_MAX: 10,
  VEHICLE_TYPE_ID_MIN: 1,
  CAPACITY_MIN: 1,
  CAPACITY_MAX: 100,
} as const

// Workflow Constants
export const VEHICLE_WORKFLOW_STEPS = {
  CREATE_VEHICLE_TYPE: 1,
  AUTO_GENERATE_SEATS: 2,
  CREATE_VEHICLE: 3,
  CREATE_TRIP: 4,
  AUTO_CREATE_TRIP_SEATS: 5,
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  VEHICLE_TYPE_CREATED: 'Vehicle type created successfully with seat configurations',
  SEAT_CONFIGURATIONS_GENERATED: 'Seat configurations generated successfully',
  VEHICLE_CREATED: 'Vehicle created successfully',
  TRIP_CREATED: 'Trip created successfully',
  TRIP_SEATS_CREATED: 'Trip seats created successfully',
} as const
