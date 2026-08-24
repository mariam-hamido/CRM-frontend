import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { removeInvitation } from '@/features/invitations/api/invitationApi'
import type { Invitation } from '@/features/invitations/types/invitation.types'
import { invitationsQueryKey } from '@/features/invitations/hooks/invitationKeys'

export function useRemoveInvitation() {
  const queryClient = useQueryClient()

  return useMutation<Invitation, ApiError, Invitation>({
    mutationFn: async (invitation) => {
      const response = await removeInvitation(invitation._id)
      return response.data
    },
    onSuccess: (invitation) => {
      void queryClient.invalidateQueries({ queryKey: invitationsQueryKey })
      toast.success(`${invitation.email} can no longer register.`)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
