import { ApiResponse } from '../types/response'

export class ApiResponseBuilder<T = any> {
  private response: ApiResponse<T>

  constructor() {
    this.response = {
      statusCode: 200,
      code: 'SUCCESS',
      message: '',
    }
  }

  setStatusCode(statusCode: number) {
    this.response.statusCode = statusCode
    return this
  }

  setCode(code: string) {
    this.response.code = code
    return this
  }

  setMessage(message: string) {
    this.response.message = message
    return this
  }

  setData(data: T) {
    this.response.data = data
    return this
  }

  build() {
    return this.response
  }
}
