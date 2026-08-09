import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import {
  getPipelineStages,
  getPipelineStagesByPipeline,
} from '@/features/pipelines/api/pipelineStageApi'
import {
  pipelineStagesByPipelineQueryKey,
  pipelineStagesListQueryKey,
} from '@/features/pipelines/hooks/pipelineKeys'
import type {
  PipelineStageListData,
  PipelineStageListParams,
  PipelineStagesByPipelineData,
} from '@/features/pipelines/types/pipelineStage.types'

export function usePipelineStages(params: PipelineStageListParams = {}) {
  return useQuery<PipelineStageListData, ApiError>({
    queryKey: pipelineStagesListQueryKey(params),
    queryFn: async () => {
      const response = await getPipelineStages(params)
      return response.data
    },
  })
}

export function usePipelineStagesByPipeline(
  pipelineId: string | undefined
) {
  return useQuery<PipelineStagesByPipelineData, ApiError>({
    queryKey: pipelineStagesByPipelineQueryKey(pipelineId),
    queryFn: async () => {
      if (!pipelineId) throw new Error('Pipeline ID is required')
      const response = await getPipelineStagesByPipeline(pipelineId)
      return response.data
    },
    enabled: Boolean(pipelineId),
  })
}
