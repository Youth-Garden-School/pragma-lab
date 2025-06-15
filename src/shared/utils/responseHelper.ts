import { NextApiResponse } from 'next'
import { ApiResponse } from '../types/response'
import { AppException } from '../exceptions/AppException'

export function sendResponse<T>(res: NextApiResponse, data: ApiResponse<T>): void {
  res.status(data.statusCode).json(data)
}

export function sendSuccess<T>(
  res: NextApiResponse,
  data: T,
  message: string = 'Success',
  statusCode: number = 200,
): void {
  sendResponse(res, {
    statusCode,
    code: 'SUCCESS',
    message,
    data,
  })
}

export function sendError(res: NextApiResponse, error: Error | AppException): void {
  if (error instanceof AppException) {
    sendResponse(res, {
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
    })
  } else {
    sendResponse(res, {
      statusCode: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal Server Error',
    })
  }
}
