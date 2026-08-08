import { apiClient } from '@/api/client'
import { LEADS } from '@/api/endpoints'
import type {
  ConvertLeadPayload,
  ConvertLeadResponse,
  CreateLeadPayload,
  DeleteLeadResponse,
  LeadListParams,
  LeadListResponse,
  LeadResponse,
  UpdateLeadPayload,
} from '@/features/leads/types/lead.types'

export async function getLeads(
  params: LeadListParams = {}
): Promise<LeadListResponse> {
  const response = await apiClient.get<LeadListResponse>(LEADS.BASE, { params })
  return response.data
}

export async function getLead(id: string): Promise<LeadResponse> {
  const response = await apiClient.get<LeadResponse>(`${LEADS.BASE}/${id}`)
  return response.data
}

export async function createLead(
  data: CreateLeadPayload
): Promise<LeadResponse> {
  const response = await apiClient.post<LeadResponse>(LEADS.BASE, data)
  return response.data
}

export async function updateLead(
  id: string,
  data: UpdateLeadPayload
): Promise<LeadResponse> {
  const response = await apiClient.put<LeadResponse>(
    `${LEADS.BASE}/${id}`,
    data
  )
  return response.data
}

export async function deleteLead(id: string): Promise<DeleteLeadResponse> {
  const response = await apiClient.delete<DeleteLeadResponse>(
    `${LEADS.BASE}/${id}`
  )
  return response.data
}

export async function convertLead(
  id: string,
  data: ConvertLeadPayload
): Promise<ConvertLeadResponse> {
  const response = await apiClient.patch<ConvertLeadResponse>(
    `${LEADS.BASE}/${id}/convert`,
    data
  )
  return response.data
}
