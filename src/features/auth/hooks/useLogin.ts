import { useMutation } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { login } from '@/features/auth/api/authApi'
import { useAuthStore } from '@/features/auth/store/authStore'
import type {
  LoginRequest,
  LoginResponse,
} from '@/features/auth/types/auth.types'

export function useLogin() {
  const storeLogin = useAuthStore((state) => state.login)

  return useMutation<LoginResponse, ApiError, LoginRequest>({
    mutationFn: login,
    onSuccess: (response) => {
      storeLogin(response.data.user, response.data.token)
    },
  })
}
