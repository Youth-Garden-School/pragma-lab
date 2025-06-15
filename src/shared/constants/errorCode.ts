export interface ErrorCodeType {
  statusCode: number
  code: string
  message: string
}

export const ErrorCode = {
  // 400 Bad Request
  BAD_REQUEST: {
    statusCode: 400,
    code: 'BAD_REQUEST',
    message: 'Bad Request',
  },
  INVALID_INPUT: {
    statusCode: 400,
    code: 'INVALID_INPUT',
    message: 'Invalid input data',
  },
  VALIDATION_ERROR: {
    statusCode: 400,
    code: 'VALIDATION_ERROR',
    message: 'Validation error',
  },

  // 401 Unauthorized
  UNAUTHORIZED: {
    statusCode: 401,
    code: 'UNAUTHORIZED',
    message: 'Unauthorized',
  },
  INVALID_CREDENTIALS: {
    statusCode: 401,
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid credentials',
  },
  TOKEN_EXPIRED: {
    statusCode: 401,
    code: 'TOKEN_EXPIRED',
    message: 'Token has expired',
  },

  // 403 Forbidden
  FORBIDDEN: {
    statusCode: 403,
    code: 'FORBIDDEN',
    message: 'Forbidden',
  },
  INSUFFICIENT_PERMISSIONS: {
    statusCode: 403,
    code: 'INSUFFICIENT_PERMISSIONS',
    message: 'Insufficient permissions',
  },

  // 404 Not Found
  NOT_FOUND: {
    statusCode: 404,
    code: 'NOT_FOUND',
    message: 'Not Found',
  },
  USER_NOT_FOUND: {
    statusCode: 404,
    code: 'USER_NOT_FOUND',
    message: 'User not found',
  },
  RESOURCE_NOT_FOUND: {
    statusCode: 404,
    code: 'RESOURCE_NOT_FOUND',
    message: 'Resource not found',
  },

  // 409 Conflict
  CONFLICT: {
    statusCode: 409,
    code: 'CONFLICT',
    message: 'Conflict',
  },
  DUPLICATE_EMAIL: {
    statusCode: 409,
    code: 'DUPLICATE_EMAIL',
    message: 'Email already exists',
  },
  DUPLICATE_PHONE: {
    statusCode: 409,
    code: 'DUPLICATE_PHONE',
    message: 'Phone number already exists',
  },

  // 500 Internal Server Error
  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Internal Server Error',
  },
  DATABASE_ERROR: {
    statusCode: 500,
    code: 'DATABASE_ERROR',
    message: 'Database error occurred',
  },
  EXTERNAL_SERVICE_ERROR: {
    statusCode: 500,
    code: 'EXTERNAL_SERVICE_ERROR',
    message: 'External service error',
  },
} as const

export type ErrorCodeKey = keyof typeof ErrorCode
