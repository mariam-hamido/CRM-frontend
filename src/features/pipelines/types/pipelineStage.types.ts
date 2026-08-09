import type { ApiResponse, Pagination } from '@/types/api'

export interface PipelineStage {
  _id: string
  company: string
  pipeline: string
  name: string
  description?: string
  order: number
  color: string
  probability: number
  isWonStage: boolean
  isLostStage: boolean
  isActive: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface PipelineStageListParams {
  page?: number
  limit?: number
  pipeline?: string
}

export interface PipelineStageListData {
  stages: PipelineStage[]
  pagination: Pagination
}

export interface PipelineStagesByPipelineData {
  stages: PipelineStage[]
}

export interface CreatePipelineStagePayload {
  pipeline: string
  name: string
  order?: number
  description?: string
  color?: string
  probability?: number
  isWonStage?: boolean
  isLostStage?: boolean
}

export interface UpdatePipelineStagePayload {
  name?: string
  description?: string
  order?: number
  color?: string
  probability?: number
  isWonStage?: boolean
  isLostStage?: boolean
}

export type PipelineStageListResponse = ApiResponse<PipelineStageListData>
export type PipelineStagesByPipelineResponse =
  ApiResponse<PipelineStagesByPipelineData>
export type PipelineStageResponse = ApiResponse<PipelineStage>
export type DeletePipelineStageResponse = ApiResponse<null>
