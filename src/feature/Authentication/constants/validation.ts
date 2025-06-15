export const AUTH_CONSTANTS = {
  EMAIL_REGEX: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 32,
} as const

export const AUTH_MESSAGES = {
  EMAIL_REQUIRED: 'Vui lòng nhập email',
  EMAIL_INVALID: 'Email không hợp lệ',
  PASSWORD_REQUIRED: 'Vui lòng nhập mật khẩu',
  PASSWORD_MIN_LENGTH: 'Mật khẩu phải có ít nhất 8 ký tự',
  PASSWORD_MAX_LENGTH: 'Mật khẩu không được vượt quá 32 ký tự',
  CONFIRM_PASSWORD_REQUIRED: 'Vui lòng xác nhận mật khẩu',
  PASSWORDS_DONT_MATCH: 'Mật khẩu xác nhận không khớp',
} as const
