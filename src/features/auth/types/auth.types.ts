import type { ApiResponse } from '@/types/api'

export type { ApiResponse }

export type UserRole = 'admin' | 'manager' | 'sales'

export interface LoginRequest {
  email: string
  password: string
}

// Company Admin First Registration - creates a NEW company plus its admin.
// The backend assigns role="admin" and derives the company identity from
// companyName; clients never send role/company ids.
export interface AdminRegisterRequest {
  companyName: string
  firstName: string
  lastName: string
  email: string
  password: string
}

// Employee First Registration - requires an admin-created invitation for
// (companyName, email) to exist and be pending on the backend.
export interface EmployeeRegisterRequest {
  companyName: string
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface AuthUser {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  company: string
  role: UserRole
  isActive: boolean
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

export type LoginResponse = ApiResponse<{ user: AuthUser; token: string }>

// Neither registration flow returns a token; users sign in afterwards.
export type AdminRegisterResponse = ApiResponse<AuthUser>

export type EmployeeRegisterResponse = ApiResponse<AuthUser>

// Profile update - only user-editable personal fields. Email, role, company,
// status and timestamps are system-managed and cannot be changed.
export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phone?: string
}

export type UpdateProfileResponse = ApiResponse<AuthUser>

export interface AuthErrorDetail {
  field: string
  message: string
}

export interface AuthError {
  message: string
  errors?: AuthErrorDetail[]
}
