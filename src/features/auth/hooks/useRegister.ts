import { useMutation } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { register } from '@/features/auth/api/authApi'
import type {
  RegisterRequest,
  RegisterResponse,
} from '@/features/auth/types/auth.types'

export function useRegister() {
  return useMutation<RegisterResponse, ApiError, RegisterRequest>({
    mutationFn: register,
  })
}
