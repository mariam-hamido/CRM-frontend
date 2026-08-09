import { apiClient } from '@/api/client'
import { DEALS } from '@/api/endpoints'
import type {
  CreateDealPayload,
  DeleteDealResponse,
  DealListParams,
  DealListResponse,
  DealResponse,
  MarkDealLostPayload,
  MoveDealStagePayload,
  UpdateDealPayload,
} from '@/features/deals/types/deal.types'

export async function getDeals(
  params: DealListParams = {}
): Promise<DealListResponse> {
  const response = await apiClient.get<DealListResponse>(DEALS.BASE, {
    params,
  })
  return response.data
}

export async function getDeal(id: string): Promise<DealResponse> {
  const response = await apiClient.get<DealResponse>(DEALS.DETAIL(id))
  return response.data
}

export async function createDeal(
  data: CreateDealPayload
): Promise<DealResponse> {
  const response = await apiClient.post<DealResponse>(DEALS.BASE, data)
  return response.data
}

export async function updateDeal(
  id: string,
  data: UpdateDealPayload
): Promise<DealResponse> {
  const response = await apiClient.put<DealResponse>(DEALS.DETAIL(id), data)
  return response.data
}

export async function deleteDeal(id: string): Promise<DeleteDealResponse> {
  const response = await apiClient.delete<DeleteDealResponse>(DEALS.DETAIL(id))
  return response.data
}

export async function moveDealStage(
  id: string,
  data: MoveDealStagePayload
): Promise<DealResponse> {
  const response = await apiClient.patch<DealResponse>(DEALS.STAGE(id), data)
  return response.data
}

export async function markDealWon(id: string): Promise<DealResponse> {
  const response = await apiClient.patch<DealResponse>(DEALS.WON(id))
  return response.data
}

export async function markDealLost(
  id: string,
  data?: MarkDealLostPayload
): Promise<DealResponse> {
  const response = await apiClient.patch<DealResponse>(DEALS.LOST(id), data)
  return response.data
}
