import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getLead } from '@/features/leads/api/leadApi'
import { leadDetailQueryKey } from '@/features/leads/hooks/leadKeys'
import type { Lead } from '@/features/leads/types/lead.types'

export function useLead(id: string | undefined) {
  return useQuery<Lead, ApiError>({
    queryKey: leadDetailQueryKey(id),
    queryFn: async () => {
      if (!id) throw new Error('Lead ID is required')
      const response = await getLead(id)
      return response.data
    },
    enabled: Boolean(id),
  })
}
