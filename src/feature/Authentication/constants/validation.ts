export const AUTH_CONSTANTS = {
  EMAIL_REGEX: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 20,
} as const

export const AUTH_MESSAGES = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Invalid email address',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: `Password must be at least ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} characters`,
  PASSWORD_MAX_LENGTH: `Password must be at most ${AUTH_CONSTANTS.PASSWORD_MAX_LENGTH} characters`,
  CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
} as const
