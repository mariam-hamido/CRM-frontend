import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { createPipelineStage } from '@/features/pipelines/api/pipelineStageApi'
import { pipelineStagesQueryKey } from '@/features/pipelines/hooks/pipelineKeys'
import type {
  CreatePipelineStagePayload,
  PipelineStage,
} from '@/features/pipelines/types/pipelineStage.types'

export function useCreatePipelineStage() {
  const queryClient = useQueryClient()

  return useMutation<PipelineStage, ApiError, CreatePipelineStagePayload>({
    mutationFn: async (payload) => {
      const response = await createPipelineStage(payload)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: pipelineStagesQueryKey })
      toast.success('Pipeline stage created successfully.')
    },
  })
}
