import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getSalesStats } from '@/features/dashboard/api/dashboardApi'
import { dashboardSalesQueryKey } from '@/features/dashboard/hooks/dashboardKeys'
import type {
  DashboardSalesParams,
  DashboardSalesStats,
} from '@/features/dashboard/types/dashboard.types'

export function useSalesStats(params: DashboardSalesParams = {}) {
  return useQuery<DashboardSalesStats, ApiError>({
    queryKey: dashboardSalesQueryKey(params),
    queryFn: async () => {
      const response = await getSalesStats(params)
      return response.data
    },
  })
}
