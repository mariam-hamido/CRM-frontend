import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { updateLead } from '@/features/leads/api/leadApi'
import {
  leadDetailQueryKey,
  leadsQueryKey,
} from '@/features/leads/hooks/leadKeys'
import type { UpdateLeadPayload } from '@/features/leads/types/lead.types'
import type { Lead } from '@/features/leads/types/lead.types'

export function useUpdateLead() {
  const queryClient = useQueryClient()

  return useMutation<Lead, ApiError, { id: string; payload: UpdateLeadPayload }>({
    mutationFn: async ({ id, payload }) => {
      const response = await updateLead(id, payload)
      return response.data
    },
    onSuccess: (lead) => {
      queryClient.setQueryData<Lead>(leadDetailQueryKey(lead._id), lead)
      void queryClient.invalidateQueries({ queryKey: leadsQueryKey })
      toast.success('Lead updated successfully.')
    },
  })
}
