import type { ApiResponse } from '@/types/api'
import type { UserRole } from '@/features/auth/types/auth.types'

export type { ApiResponse }

// Safe employee representation returned by the backend employee-management
// API - never includes password or other auth internals.
export interface Employee {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: string
}

export type EmployeeStatusFilter = 'active' | 'inactive'

export interface EmployeeListParams {
  page?: number
  limit?: number
  sortBy?: 'firstName' | 'lastName' | 'email' | 'role' | 'isActive' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  status?: EmployeeStatusFilter
}

export interface Pagination {
  total: number
  totalPages: number
  page: number
  limit: number
}

export interface EmployeeListData {
  employees: Employee[]
  pagination: Pagination
}

export type EmployeeListResponse = ApiResponse<EmployeeListData>

export type EmployeeResponse = ApiResponse<Employee>
