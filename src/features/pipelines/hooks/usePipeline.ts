import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getPipeline } from '@/features/pipelines/api/pipelineApi'
import { pipelineDetailQueryKey } from '@/features/pipelines/hooks/pipelineKeys'
import type { Pipeline } from '@/features/pipelines/types/pipeline.types'

export function usePipeline(id: string | undefined) {
  return useQuery<Pipeline, ApiError>({
    queryKey: pipelineDetailQueryKey(id),
    queryFn: async () => {
      if (!id) throw new Error('Pipeline ID is required')
      const response = await getPipeline(id)
      return response.data
    },
    enabled: Boolean(id),
  })
}
