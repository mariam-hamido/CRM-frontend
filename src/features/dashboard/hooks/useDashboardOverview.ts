import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getDashboardOverview } from '@/features/dashboard/api/dashboardApi'
import { dashboardOverviewQueryKey } from '@/features/dashboard/hooks/dashboardKeys'
import type { DashboardOverview } from '@/features/dashboard/types/dashboard.types'

export function useDashboardOverview() {
  return useQuery<DashboardOverview, ApiError>({
    queryKey: dashboardOverviewQueryKey,
    queryFn: async () => {
      const response = await getDashboardOverview()
      return response.data
    },
  })
}
