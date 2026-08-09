import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getDeals } from '@/features/deals/api/dealApi'
import { dealsListQueryKey } from '@/features/deals/hooks/dealKeys'
import type {
  DealListData,
  DealListParams,
} from '@/features/deals/types/deal.types'

export function useDeals(params: DealListParams = {}, enabled = true) {
  return useQuery<DealListData, ApiError>({
    queryKey: dealsListQueryKey(params),
    queryFn: async () => {
      const response = await getDeals(params)
      return response.data
    },
    enabled,
  })
}
