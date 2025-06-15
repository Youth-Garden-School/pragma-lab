export interface ApiResponse<T = any> {
  statusCode: number
  code: string
  message: string
  data?: T
}

export interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>
