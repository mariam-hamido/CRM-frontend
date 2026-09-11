import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { createInvitation } from '@/features/invitations/api/invitationApi'
import { employeesQueryKey } from '@/features/employees/hooks/employeeKeys'
import type { Invitation } from '@/features/invitations/types/invitation.types'
import { invitationsQueryKey } from '@/features/invitations/hooks/invitationKeys'

/**
 * Creates a pending invitation for an employee email. Errors are surfaced to
 * the caller (the invite dialog) so backend business messages - e.g.
 * duplicate pending invitation or already-registered email - render inline.
 */
export function useCreateInvitation() {
  const queryClient = useQueryClient()

  return useMutation<Invitation, ApiError, string>({
    mutationFn: async (email) => {
      const response = await createInvitation(email)
      return response.data
    },
    onSuccess: (invitation) => {
      void queryClient.invalidateQueries({ queryKey: employeesQueryKey })
      void queryClient.invalidateQueries({ queryKey: invitationsQueryKey })
      // Accurate wording: the backend records an allowlist entry - it does
      // not send an email.
      toast.success(`${invitation.email} can now register as an employee.`)
    },
  })
}
