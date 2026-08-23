import { useMutation } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { registerEmployee } from '@/features/auth/api/authApi'
import type {
  EmployeeRegisterRequest,
  EmployeeRegisterResponse,
} from '@/features/auth/types/auth.types'

export function useEmployeeRegister() {
  return useMutation<
    EmployeeRegisterResponse,
    ApiError,
    EmployeeRegisterRequest
  >({
    mutationFn: registerEmployee,
  })
}
