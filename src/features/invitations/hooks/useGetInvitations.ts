import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getInvitations } from '@/features/invitations/api/invitationApi'
import type {
  InvitationListData,
  InvitationListParams,
} from '@/features/invitations/types/invitation.types'
import { invitationsListQueryKey } from '@/features/invitations/hooks/invitationKeys'

export function useGetInvitations(params: InvitationListParams = {}) {
  return useQuery<InvitationListData, ApiError>({
    queryKey: invitationsListQueryKey(params),
    queryFn: async () => {
      const response = await getInvitations(params)
      return response.data
    },
  })
}
