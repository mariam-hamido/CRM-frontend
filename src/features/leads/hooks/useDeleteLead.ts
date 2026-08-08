import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { deleteLead } from '@/features/leads/api/leadApi'
import {
  leadDetailQueryKey,
  leadsQueryKey,
} from '@/features/leads/hooks/leadKeys'

export function useDeleteLead() {
  const queryClient = useQueryClient()

  return useMutation<null, ApiError, string>({
    mutationFn: async (id) => {
      await deleteLead(id)
      return null
    },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: leadDetailQueryKey(id) })
      void queryClient.invalidateQueries({ queryKey: leadsQueryKey })
      toast.success('Lead deleted successfully.')
    },
  })
}
