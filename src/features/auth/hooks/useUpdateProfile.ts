import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { updateProfile } from '@/features/auth/api/authApi'
import { currentUserQueryKey } from '@/features/auth/hooks/useGetCurrentUser'
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
  const queryClient = useQueryClient()

  return useMutation<AuthUser, ApiError, UseUpdateProfileVariables>({
    mutationFn: async ({ data, avatarFile, removeAvatar }) => {
      const response = await updateProfile(data, avatarFile, removeAvatar)
      return response.data
    },
    onSuccess: (user) => {
      // Keep the shared store in sync so every consumer (navbar, user menu,
      // profile page) reflects the new picture without a refetch.
      setUser(user)
      // Drop the cached /auth/me snapshot so anything reading the current user
      // through react-query (e.g. after a refresh) gets server-authoritative data.
      queryClient.invalidateQueries({ queryKey: currentUserQueryKey })
    },
  })
}