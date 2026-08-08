import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { createLead } from '@/features/leads/api/leadApi'
import { leadsQueryKey } from '@/features/leads/hooks/leadKeys'
import type { CreateLeadPayload } from '@/features/leads/types/lead.types'
import type { Lead } from '@/features/leads/types/lead.types'

export function useCreateLead() {
  const queryClient = useQueryClient()

  return useMutation<Lead, ApiError, CreateLeadPayload>({
    mutationFn: async (payload) => {
      const response = await createLead(payload)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: leadsQueryKey })
      toast.success('Lead created successfully.')
    },
  })
}
