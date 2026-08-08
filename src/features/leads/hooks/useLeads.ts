import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getLeads } from '@/features/leads/api/leadApi'
import { leadsListQueryKey } from '@/features/leads/hooks/leadKeys'
import type {
  LeadListData,
  LeadListParams,
} from '@/features/leads/types/lead.types'

export function useLeads(params: LeadListParams = {}) {
  return useQuery<LeadListData, ApiError>({
    queryKey: leadsListQueryKey(params),
    queryFn: async () => {
      const response = await getLeads(params)
      return response.data
    },
  })
}
