import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getRecentActivities } from '@/features/dashboard/api/dashboardApi'
import { dashboardRecentActivitiesQueryKey } from '@/features/dashboard/hooks/dashboardKeys'
import type { RecentActivity } from '@/features/dashboard/types/dashboard.types'

export function useRecentActivities() {
  return useQuery<RecentActivity[], ApiError>({
    queryKey: dashboardRecentActivitiesQueryKey,
    queryFn: async () => {
      const response = await getRecentActivities()
      return response.data
    },
  })
}
