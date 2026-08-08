export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface Pagination {
  total: number
  totalPages: number
  page: number
  limit: number
}
