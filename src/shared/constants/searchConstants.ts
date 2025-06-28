// Search form constants
export const SEARCH_CONSTANTS = {
  // Default values
  DEFAULT_ADULT_COUNT: 1,
  DEFAULT_CHILD_COUNT: 0,
  MIN_ADULT_COUNT: 1,
  MIN_CHILD_COUNT: 0,
  MAX_TICKETS: 10,

  // Date options
  DATE_OPTIONS_COUNT: 5,

  // UI constants
  POPOVER_MAX_HEIGHT: 'max-h-64',
  INPUT_HEIGHT: 'h-11',
  MIN_INPUT_WIDTH: 'min-w-[200px]',
  MIN_TICKET_WIDTH: 'min-w-[150px]',
  MIN_SEARCH_WIDTH: 'min-w-[120px]',

  // Search behavior
  SEARCH_DEBOUNCE_MS: 300,
  MIN_SEARCH_LENGTH: 2,

  // Filter options
  SORT_OPTIONS: ['Giờ đi sớm nhất', 'Giờ đi muộn nhất', 'Giá tăng dần', 'Giá giảm dần'] as const,

  // Hover colors
  PICKUP_HOVER_COLOR: 'hover:bg-blue-50',
  PICKUP_CHILD_HOVER_COLOR: 'hover:bg-blue-100',
  DROPOFF_HOVER_COLOR: 'hover:bg-purple-50',
  DROPOFF_CHILD_HOVER_COLOR: 'hover:bg-purple-100',

  // Labels
  LABELS: {
    PICKUP_POINT: 'Điểm đón',
    DROPOFF_POINT: 'Điểm đến',
    DEPARTURE_DATE: 'Ngày đi',
    TICKET_COUNT: 'Số vé',
    SEARCH_TRIP: 'Tìm chuyến',
    SEARCH_BUTTON: 'Tìm vé',
    ADULT: 'Người lớn',
    CHILD: 'Em bé',
    DONE: 'Xong',
    PROVINCE_CITY: 'Tỉnh - Thành phố',
  } as const,

  // Placeholders
  PLACEHOLDERS: {
    PICKUP_SEARCH: 'Tìm điểm đón...',
    DROPOFF_SEARCH: 'Tìm điểm đến...',
  } as const,
} as const

// Trip status constants
export const TRIP_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DELAYED: 'delayed',
} as const

// Ticket status constants
export const TICKET_STATUS = {
  BOOKED: 'booked',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  REFUNDED: 'refunded',
} as const
