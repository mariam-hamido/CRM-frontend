import type { ApiResponse, Pagination } from '@/types/api'

export const PIPELINE_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'name',
] as const
export type PipelineSortField = (typeof PIPELINE_SORT_FIELDS)[number]

export const PIPELINE_SORT_ORDERS = ['asc', 'desc'] as const
export type PipelineSortOrder = (typeof PIPELINE_SORT_ORDERS)[number]

export interface Pipeline {
  _id: string
  company: string
  name: string
  description?: string
  color: string
  isDefault: boolean
  isActive: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface PipelineListParams {
  page?: number
  limit?: number
  search?: string
  isDefault?: boolean
  sortBy?: PipelineSortField
  sortOrder?: PipelineSortOrder
}

export interface PipelineListData {
  pipelines: Pipeline[]
  pagination: Pagination
}

export interface CreatePipelinePayload {
  name: string
  description?: string
  color?: string
  isDefault?: boolean
}

export interface UpdatePipelinePayload {
  name?: string
  description?: string
  color?: string
  isDefault?: boolean
}

export type PipelineListResponse = ApiResponse<PipelineListData>
export type PipelineResponse = ApiResponse<Pipeline>
export type DeletePipelineResponse = ApiResponse<null>
