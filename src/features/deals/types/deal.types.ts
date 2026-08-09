import type { ApiResponse, Pagination } from '@/types/api'

export const DEAL_STATUSES = ['open', 'won', 'lost'] as const
export type DealStatus = (typeof DEAL_STATUSES)[number]

export const DEAL_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'title',
  'value',
  'probability',
  'expectedCloseDate',
] as const
export type DealSortField = (typeof DEAL_SORT_FIELDS)[number]

export const DEAL_SORT_ORDERS = ['asc', 'desc'] as const
export type DealSortOrder = (typeof DEAL_SORT_ORDERS)[number]

export interface Deal {
  _id: string
  company: string
  customer: string
  owner: string
  pipeline: string
  stage: string
  title: string
  value: number
  probability: number
  expectedCloseDate?: string
  actualCloseDate: string | null
  status: DealStatus
  lostReason: string | null
  description?: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface DealListParams {
  page?: number
  limit?: number
  search?: string
  status?: DealStatus
  pipeline?: string
  stage?: string
  owner?: string
  sortBy?: DealSortField
  sortOrder?: DealSortOrder
}

export interface DealListData {
  deals: Deal[]
  pagination: Pagination
}

export interface CreateDealPayload {
  customer: string
  pipeline: string
  stage: string
  title: string
  value?: number
  expectedCloseDate?: string
  description?: string
}

export interface UpdateDealPayload {
  title?: string
  value?: number
  probability?: number
  expectedCloseDate?: string
  actualCloseDate?: string | null
  status?: DealStatus
  lostReason?: string | null
  description?: string
  owner?: string
  pipeline?: string
  stage?: string
}

export interface MoveDealStagePayload {
  stage: string
}

export interface MarkDealLostPayload {
  lostReason?: string
}

export type DealListResponse = ApiResponse<DealListData>
export type DealResponse = ApiResponse<Deal>
export type DeleteDealResponse = ApiResponse<null>
