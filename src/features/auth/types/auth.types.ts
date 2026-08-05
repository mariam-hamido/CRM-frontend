export type UserRole = 'admin' | 'manager' | 'sales'

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  company: string
  phone?: string
  avatar?: string
  role?: UserRole
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

export type RegisterResponse = ApiResponse<AuthUser>

export interface AuthErrorDetail {
  field: string
  message: string
}

export interface AuthError {
  message: string
  errors?: AuthErrorDetail[]
}
