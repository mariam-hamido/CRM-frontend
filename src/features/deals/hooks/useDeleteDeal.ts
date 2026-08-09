import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { deleteDeal } from '@/features/deals/api/dealApi'
import {
  dealDetailQueryKey,
  dealsQueryKey,
} from '@/features/deals/hooks/dealKeys'

export function useDeleteDeal() {
  const queryClient = useQueryClient()

  return useMutation<null, ApiError, string>({
    mutationFn: async (id) => {
      await deleteDeal(id)
      return null
    },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: dealDetailQueryKey(id) })
      void queryClient.invalidateQueries({ queryKey: dealsQueryKey })
      toast.success('Deal deleted successfully.')
    },
  })
}
