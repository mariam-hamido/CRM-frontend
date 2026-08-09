import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { createPipeline } from '@/features/pipelines/api/pipelineApi'
import { pipelinesQueryKey } from '@/features/pipelines/hooks/pipelineKeys'
import type {
  CreatePipelinePayload,
  Pipeline,
} from '@/features/pipelines/types/pipeline.types'

export function useCreatePipeline() {
  const queryClient = useQueryClient()

  return useMutation<Pipeline, ApiError, CreatePipelinePayload>({
    mutationFn: async (payload) => {
      const response = await createPipeline(payload)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: pipelinesQueryKey })
      toast.success('Pipeline created successfully.')
    },
  })
}
