import { apiClient } from '@/api/client'
import { AUTH } from '@/api/endpoints'
import type {
  AdminRegisterRequest,
  AdminRegisterResponse,
  EmployeeRegisterRequest,
  EmployeeRegisterResponse,
  LoginRequest,
  LoginResponse,
} from '@/features/auth/types/auth.types'

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(AUTH.LOGIN, data)
  return response.data
}

export async function registerAdmin(
  data: AdminRegisterRequest
): Promise<AdminRegisterResponse> {
  const response = await apiClient.post<AdminRegisterResponse>(
    AUTH.REGISTER_ADMIN,
    data
  )
  return response.data
}

export async function registerEmployee(
  data: EmployeeRegisterRequest
): Promise<EmployeeRegisterResponse> {
  const response = await apiClient.post<EmployeeRegisterResponse>(
    AUTH.REGISTER_EMPLOYEE,
    data
  )
  return response.data
}
