import { useMutation } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { registerAdmin } from '@/features/auth/api/authApi'
import type {
  AdminRegisterRequest,
  AdminRegisterResponse,
} from '@/features/auth/types/auth.types'

export function useAdminRegister() {
  return useMutation<AdminRegisterResponse, ApiError, AdminRegisterRequest>({
    mutationFn: registerAdmin,
  })
}
