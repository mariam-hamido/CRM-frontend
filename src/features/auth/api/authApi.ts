import { apiClient } from '@/api/client'
import { AUTH } from '@/api/endpoints'
import type {
  AdminRegisterRequest,
  AdminRegisterResponse,
  EmployeeRegisterRequest,
  EmployeeRegisterResponse,
  LoginRequest,
  LoginResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
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

export async function getCurrentUser(): Promise<UpdateProfileResponse> {
  const response = await apiClient.get<UpdateProfileResponse>(AUTH.ME)
  return response.data
}

export async function updateProfile(
  data: UpdateProfileRequest,
  avatarFile?: File,
  removeAvatar?: boolean
): Promise<UpdateProfileResponse> {
  if (avatarFile) {
    const formData = new FormData()

    if (data.firstName !== undefined) formData.append('firstName', data.firstName)
    if (data.lastName !== undefined) formData.append('lastName', data.lastName)
    if (data.phone !== undefined) formData.append('phone', data.phone)

    formData.append('avatar', avatarFile)

    // Axios detects FormData in the browser and lets XMLHttpRequest set the
    // multipart Content-Type (with boundary) automatically.
    const response = await apiClient.patch<UpdateProfileResponse>(AUTH.ME, formData)
    return response.data
  }

  const response = await apiClient.patch<UpdateProfileResponse>(AUTH.ME, {
    ...data,
    ...(removeAvatar ? { removeAvatar: true } : {}),
  })
  return response.data
}
