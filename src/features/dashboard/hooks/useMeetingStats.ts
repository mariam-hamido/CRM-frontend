import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getMeetingStats } from '@/features/dashboard/api/dashboardApi'
import { dashboardMeetingStatsQueryKey } from '@/features/dashboard/hooks/dashboardKeys'
import type {
  DashboardMeetingStats,
  DashboardMeetingStatsParams,
} from '@/features/dashboard/types/dashboard.types'

export function useMeetingStats(params: DashboardMeetingStatsParams = {}) {
  return useQuery<DashboardMeetingStats, ApiError>({
    queryKey: dashboardMeetingStatsQueryKey(params),
    queryFn: async () => {
      const response = await getMeetingStats(params)
      return response.data
    },
  })
}
