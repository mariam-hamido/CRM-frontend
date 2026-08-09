import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { createDeal } from '@/features/deals/api/dealApi'
import { dealsQueryKey } from '@/features/deals/hooks/dealKeys'
import type { CreateDealPayload } from '@/features/deals/types/deal.types'
import type { Deal } from '@/features/deals/types/deal.types'

export function useCreateDeal() {
  const queryClient = useQueryClient()

  return useMutation<Deal, ApiError, CreateDealPayload>({
    mutationFn: async (payload) => {
      const response = await createDeal(payload)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: dealsQueryKey })
      toast.success('Deal created successfully.')
    },
  })
}
