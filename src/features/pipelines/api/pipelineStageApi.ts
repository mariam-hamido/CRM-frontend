import { apiClient } from '@/api/client'
import { PIPELINE_STAGES } from '@/api/endpoints'
import type {
  CreatePipelineStagePayload,
  DeletePipelineStageResponse,
  PipelineStageListParams,
  PipelineStageListResponse,
  PipelineStageResponse,
  PipelineStagesByPipelineResponse,
  UpdatePipelineStagePayload,
} from '@/features/pipelines/types/pipelineStage.types'

export async function createPipelineStage(
  data: CreatePipelineStagePayload
): Promise<PipelineStageResponse> {
  const response = await apiClient.post<PipelineStageResponse>(
    PIPELINE_STAGES.BASE,
    data
  )
  return response.data
}

export async function getPipelineStages(
  params: PipelineStageListParams = {}
): Promise<PipelineStageListResponse> {
  const response = await apiClient.get<PipelineStageListResponse>(
    PIPELINE_STAGES.BASE,
    { params }
  )
  return response.data
}

export async function getPipelineStagesByPipeline(
  pipelineId: string
): Promise<PipelineStagesByPipelineResponse> {
  const response = await apiClient.get<PipelineStagesByPipelineResponse>(
    PIPELINE_STAGES.BY_PIPELINE(pipelineId)
  )
  return response.data
}

export async function getPipelineStage(
  id: string
): Promise<PipelineStageResponse> {
  const response = await apiClient.get<PipelineStageResponse>(
    PIPELINE_STAGES.DETAIL(id)
  )
  return response.data
}

export async function updatePipelineStage(
  id: string,
  data: UpdatePipelineStagePayload
): Promise<PipelineStageResponse> {
  const response = await apiClient.put<PipelineStageResponse>(
    PIPELINE_STAGES.DETAIL(id),
    data
  )
  return response.data
}

export async function deletePipelineStage(
  id: string
): Promise<DeletePipelineStageResponse> {
  const response = await apiClient.delete<DeletePipelineStageResponse>(
    PIPELINE_STAGES.DETAIL(id)
  )
  return response.data
}
