export enum ApiEndpointEnum {
  AUTH_SIGNUP = '/auth/signup',
  AUTH_LOGIN = '/auth/login',
  AUTH_LOGOUT = '/auth/logout',

  // Trip Management
  TRIPS = '/trip',

  // Seat Configuration Management
  SEAT_CONFIGURATIONS = '/seat-configurations',
  SEAT_CONFIGURATIONS_BULK = '/seat-configurations/bulk',
  SEAT_CONFIGURATIONS_AVAILABILITY = '/seat-configurations/availability',
  SEAT_CONFIGURATION_BY_ID = '/seat-configurations/[id]',

  // Trip Seats Management
  TRIP_SEATS = '/trip-seats',

  // Vehicle Types
  VEHICLE_TYPES = '/vehicletypes',

  // Locations
  LOCATIONS = '/locations',
}
