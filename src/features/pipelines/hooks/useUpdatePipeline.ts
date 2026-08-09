import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { updatePipeline } from '@/features/pipelines/api/pipelineApi'
import {
  pipelineDetailQueryKey,
  pipelineStagesQueryKey,
  pipelinesQueryKey,
} from '@/features/pipelines/hooks/pipelineKeys'
import type {
  Pipeline,
  UpdatePipelinePayload,
} from '@/features/pipelines/types/pipeline.types'

export function useUpdatePipeline() {
  const queryClient = useQueryClient()

  return useMutation<
    Pipeline,
    ApiError,
    { id: string; payload: UpdatePipelinePayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await updatePipeline(id, payload)
      return response.data
    },
    onSuccess: (pipeline) => {
      queryClient.setQueryData<Pipeline>(
        pipelineDetailQueryKey(pipeline._id),
        pipeline
      )
      void queryClient.invalidateQueries({ queryKey: pipelinesQueryKey })
      void queryClient.invalidateQueries({ queryKey: pipelineStagesQueryKey })
      toast.success('Pipeline updated successfully.')
    },
  })
}
