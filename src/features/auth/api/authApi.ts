import { apiClient } from '@/api/client'
import { AUTH } from '@/api/endpoints'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/features/auth/types/auth.types'

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(AUTH.LOGIN, data)
  return response.data
}

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const response = await apiClient.post<RegisterResponse>(AUTH.REGISTER, data)
  return response.data
}
