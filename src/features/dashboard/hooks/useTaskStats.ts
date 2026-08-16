import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getTaskStats } from '@/features/dashboard/api/dashboardApi'
import { dashboardTaskStatsQueryKey } from '@/features/dashboard/hooks/dashboardKeys'
import type {
  DashboardTaskStats,
  DashboardTaskStatsParams,
} from '@/features/dashboard/types/dashboard.types'

export function useTaskStats(params: DashboardTaskStatsParams = {}) {
  return useQuery<DashboardTaskStats, ApiError>({
    queryKey: dashboardTaskStatsQueryKey(params),
    queryFn: async () => {
      const response = await getTaskStats(params)
      return response.data
    },
  })
}
