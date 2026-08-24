import type { InvitationListParams } from '@/features/invitations/types/invitation.types'

export const invitationsQueryKey = ['invitations'] as const

export function invitationsListQueryKey(params: InvitationListParams = {}) {
  return ['invitations', 'list', params] as const
}
