import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '@/features/auth/api/authApi'
import type {
  UpdateProfileResponse,
} from '@/features/auth/types/auth.types'

// Single canonical query key for the authenticated user so mutations can
// invalidate it and every consumer shares the same cache entry.
export const currentUserQueryKey = ['auth', 'currentUser'] as const

export function currentUserOptions() {
  return {
    queryKey: currentUserQueryKey,
    queryFn: async (): Promise<UpdateProfileResponse> => getCurrentUser(),
    staleTime: 30_000,
  }
}

interface UseGetCurrentUserOptions {
  /** Gate the fetch so unauthenticated/anonymous routes never hit /auth/me. */
  enabled?: boolean
}

export function useGetCurrentUser(options?: UseGetCurrentUserOptions) {
  return useQuery({
    ...currentUserOptions(),
    enabled: options?.enabled ?? true,
  })
}
