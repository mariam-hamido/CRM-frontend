import type { PipelineListParams } from '@/features/pipelines/types/pipeline.types'
import type {
  PipelineStageListParams,
} from '@/features/pipelines/types/pipelineStage.types'

export const pipelinesQueryKey = ['pipelines'] as const

export function pipelinesListQueryKey(params: PipelineListParams = {}) {
  return ['pipelines', 'list', params] as const
}

export function pipelineDetailQueryKey(id: string | undefined) {
  return ['pipelines', 'detail', id] as const
}

export const pipelineStagesQueryKey = ['pipeline-stages'] as const

export function pipelineStagesListQueryKey(
  params: PipelineStageListParams = {}
) {
  return ['pipeline-stages', 'list', params] as const
}

export function pipelineStagesByPipelineQueryKey(
  pipelineId: string | undefined
) {
  return ['pipeline-stages', 'pipeline', pipelineId] as const
}

export function pipelineStageDetailQueryKey(id: string | undefined) {
  return ['pipeline-stages', 'detail', id] as const
}
