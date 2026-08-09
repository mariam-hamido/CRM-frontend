import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { moveDealStage } from '@/features/deals/api/dealApi'
import {
  dealDetailQueryKey,
  dealsQueryKey,
} from '@/features/deals/hooks/dealKeys'
import type { MoveDealStagePayload } from '@/features/deals/types/deal.types'
import type { Deal } from '@/features/deals/types/deal.types'

export function useMoveDealStage() {
  const queryClient = useQueryClient()

  return useMutation<
    Deal,
    ApiError,
    { id: string; payload: MoveDealStagePayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await moveDealStage(id, payload)
      return response.data
    },
    onSuccess: (deal) => {
      queryClient.setQueryData<Deal>(dealDetailQueryKey(deal._id), deal)
      void queryClient.invalidateQueries({ queryKey: dealsQueryKey })
    },
    onError: () => {
      void queryClient.invalidateQueries({ queryKey: dealsQueryKey })
      toast.error('Could not move the deal. Please try again.')
    },
  })
}
