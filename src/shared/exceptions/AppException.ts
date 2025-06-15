import { ErrorCode, ErrorCodeType } from '../constants/errorCode'

export class AppException extends Error {
  public readonly statusCode: number
  public readonly code: string

  constructor(errorCode: ErrorCodeType, customMessage?: string) {
    super(customMessage || errorCode.message)
    this.name = 'AppException'
    this.statusCode = errorCode.statusCode
    this.code = errorCode.code
  }

  static BadRequest(message?: string) {
    return new AppException(ErrorCode.BAD_REQUEST, message)
  }

  static Unauthorized(message?: string) {
    return new AppException(ErrorCode.UNAUTHORIZED, message)
  }

  static Forbidden(message?: string) {
    return new AppException(ErrorCode.FORBIDDEN, message)
  }

  static NotFound(message?: string) {
    return new AppException(ErrorCode.NOT_FOUND, message)
  }

  static Conflict(message?: string) {
    return new AppException(ErrorCode.CONFLICT, message)
  }

  static InternalServerError(message?: string) {
    return new AppException(ErrorCode.INTERNAL_SERVER_ERROR, message)
  }
}
