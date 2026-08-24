import type { ApiResponse } from '@/types/api'

export type { ApiResponse }

export type InvitationStatus = 'pending' | 'accepted' | 'removed'

// Allowlist entry returned by the backend invitation API - an email approval,
// not a user account. Contains no credentials or auth internals.
export interface Invitation {
  _id: string
  company: string
  email: string
  invitedBy: string
  status: InvitationStatus
  invitedAt: string
  acceptedAt: string | null
  removedAt: string | null
  createdAt: string
  updatedAt: string
}

export type InvitationListParams = {
  page?: number
  limit?: number
  sortBy?: 'email' | 'status' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  status?: InvitationStatus
}

export interface Pagination {
  total: number
  totalPages: number
  page: number
  limit: number
}

export interface InvitationListData {
  invitations: Invitation[]
  pagination: Pagination
}

export type InvitationListResponse = ApiResponse<InvitationListData>

export type InvitationResponse = ApiResponse<Invitation>
