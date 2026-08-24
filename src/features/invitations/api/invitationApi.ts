import { apiClient } from '@/api/client'
import { INVITATIONS } from '@/api/endpoints'
import type {
  InvitationListParams,
  InvitationListResponse,
  InvitationResponse,
} from '@/features/invitations/types/invitation.types'

export async function getInvitations(
  params: InvitationListParams = {}
): Promise<InvitationListResponse> {
  const response = await apiClient.get<InvitationListResponse>(
    INVITATIONS.BASE,
    {
      params,
    }
  )
  return response.data
}

// The backend derives company and inviter from the authenticated admin -
// only the email is sent.
export async function createInvitation(
  email: string
): Promise<InvitationResponse> {
  const response = await apiClient.post<InvitationResponse>(INVITATIONS.BASE, {
    email,
  })
  return response.data
}

export async function removeInvitation(
  id: string
): Promise<InvitationResponse> {
  const response = await apiClient.delete<InvitationResponse>(
    INVITATIONS.DETAIL(id)
  )
  return response.data
}
