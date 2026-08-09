import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { deletePipelineStage } from '@/features/pipelines/api/pipelineStageApi'
import {
  pipelineStageDetailQueryKey,
  pipelineStagesQueryKey,
} from '@/features/pipelines/hooks/pipelineKeys'

export function useDeletePipelineStage() {
  const queryClient = useQueryClient()

  return useMutation<null, ApiError, string>({
    mutationFn: async (id) => {
      await deletePipelineStage(id)
      return null
    },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: pipelineStageDetailQueryKey(id) })
      void queryClient.invalidateQueries({ queryKey: pipelineStagesQueryKey })
      toast.success('Pipeline stage deleted successfully.')
    },
  })
}
