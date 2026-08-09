import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { updatePipelineStage } from '@/features/pipelines/api/pipelineStageApi'
import {
  pipelineStageDetailQueryKey,
  pipelineStagesQueryKey,
} from '@/features/pipelines/hooks/pipelineKeys'
import type {
  PipelineStage,
  UpdatePipelineStagePayload,
} from '@/features/pipelines/types/pipelineStage.types'

export function useUpdatePipelineStage() {
  const queryClient = useQueryClient()

  return useMutation<
    PipelineStage,
    ApiError,
    { id: string; payload: UpdatePipelineStagePayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await updatePipelineStage(id, payload)
      return response.data
    },
    onSuccess: (stage) => {
      queryClient.setQueryData<PipelineStage>(
        pipelineStageDetailQueryKey(stage._id),
        stage
      )
      void queryClient.invalidateQueries({ queryKey: pipelineStagesQueryKey })
      toast.success('Pipeline stage updated successfully.')
    },
  })
}
