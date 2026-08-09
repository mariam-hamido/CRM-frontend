import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getPipelines } from '@/features/pipelines/api/pipelineApi'
import { pipelinesListQueryKey } from '@/features/pipelines/hooks/pipelineKeys'
import type {
  PipelineListData,
  PipelineListParams,
} from '@/features/pipelines/types/pipeline.types'

export function usePipelines(params: PipelineListParams = {}) {
  return useQuery<PipelineListData, ApiError>({
    queryKey: pipelinesListQueryKey(params),
    queryFn: async () => {
      const response = await getPipelines(params)
      return response.data
    },
  })
}
