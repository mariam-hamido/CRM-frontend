import { apiClient } from '@/api/client'
import { PIPELINES } from '@/api/endpoints'
import type {
  CreatePipelinePayload,
  DeletePipelineResponse,
  PipelineListParams,
  PipelineListResponse,
  PipelineResponse,
  UpdatePipelinePayload,
} from '@/features/pipelines/types/pipeline.types'

export async function getPipelines(
  params: PipelineListParams = {}
): Promise<PipelineListResponse> {
  const response = await apiClient.get<PipelineListResponse>(PIPELINES.BASE, {
    params,
  })
  return response.data
}

export async function getPipeline(id: string): Promise<PipelineResponse> {
  const response = await apiClient.get<PipelineResponse>(PIPELINES.DETAIL(id))
  return response.data
}

export async function createPipeline(
  data: CreatePipelinePayload
): Promise<PipelineResponse> {
  const response = await apiClient.post<PipelineResponse>(PIPELINES.BASE, data)
  return response.data
}

export async function updatePipeline(
  id: string,
  data: UpdatePipelinePayload
): Promise<PipelineResponse> {
  const response = await apiClient.put<PipelineResponse>(
    PIPELINES.DETAIL(id),
    data
  )
  return response.data
}

export async function deletePipeline(
  id: string
): Promise<DeletePipelineResponse> {
  const response = await apiClient.delete<DeletePipelineResponse>(
    PIPELINES.DETAIL(id)
  )
  return response.data
}
