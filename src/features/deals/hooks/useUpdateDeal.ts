import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { updateDeal } from '@/features/deals/api/dealApi'
import {
  dealDetailQueryKey,
  dealsQueryKey,
} from '@/features/deals/hooks/dealKeys'
import type { UpdateDealPayload } from '@/features/deals/types/deal.types'
import type { Deal } from '@/features/deals/types/deal.types'

export function useUpdateDeal() {
  const queryClient = useQueryClient()

  return useMutation<Deal, ApiError, { id: string; payload: UpdateDealPayload }>({
    mutationFn: async ({ id, payload }) => {
      const response = await updateDeal(id, payload)
      return response.data
    },
    onSuccess: (deal) => {
      queryClient.setQueryData<Deal>(dealDetailQueryKey(deal._id), deal)
      void queryClient.invalidateQueries({ queryKey: dealsQueryKey })
      toast.success('Deal updated successfully.')
    },
  })
}
