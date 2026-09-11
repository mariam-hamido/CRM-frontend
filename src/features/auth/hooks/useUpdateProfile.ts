import { useMutation } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { updateProfile } from '@/features/auth/api/authApi'
import { useAuthStore } from '@/features/auth/store/authStore'
import type {
  AuthUser,
  UpdateProfileRequest,
} from '@/features/auth/types/auth.types'

export interface UseUpdateProfileVariables {
  data: UpdateProfileRequest
  avatarFile?: File
  removeAvatar?: boolean
}

export function useUpdateProfile() {
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation<AuthUser, ApiError, UseUpdateProfileVariables>({
    mutationFn: async ({ data, avatarFile, removeAvatar }) => {
      const response = await updateProfile(data, avatarFile, removeAvatar)
      return response.data
    },
    onSuccess: (user) => {
      setUser(user)
    },
  })
}