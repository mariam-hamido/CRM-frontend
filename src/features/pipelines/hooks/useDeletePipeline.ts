import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { deletePipeline } from '@/features/pipelines/api/pipelineApi'
import {
  pipelineDetailQueryKey,
  pipelineStagesQueryKey,
  pipelinesQueryKey,
} from '@/features/pipelines/hooks/pipelineKeys'

export function useDeletePipeline() {
  const queryClient = useQueryClient()

  return useMutation<null, ApiError, string>({
    mutationFn: async (id) => {
      await deletePipeline(id)
      return null
    },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: pipelineDetailQueryKey(id) })
      void queryClient.invalidateQueries({ queryKey: pipelinesQueryKey })
      void queryClient.invalidateQueries({ queryKey: pipelineStagesQueryKey })
      toast.success('Pipeline deleted successfully.')
    },
  })
}
