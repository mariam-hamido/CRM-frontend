import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getDeal } from '@/features/deals/api/dealApi'
import { dealDetailQueryKey } from '@/features/deals/hooks/dealKeys'
import type { Deal } from '@/features/deals/types/deal.types'

export function useDeal(id: string | undefined) {
  return useQuery<Deal, ApiError>({
    queryKey: dealDetailQueryKey(id),
    queryFn: async () => {
      if (!id) throw new Error('Deal ID is required')
      const response = await getDeal(id)
      return response.data
    },
    enabled: Boolean(id),
  })
}
