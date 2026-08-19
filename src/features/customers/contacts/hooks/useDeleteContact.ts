import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { deleteCustomerContact } from '@/features/customers/contacts/api/customerContactApi'
import {
  contactDetailQueryKey,
  customerContactsQueryKey,
  globalContactsQueryKey,
} from '@/features/customers/contacts/hooks/customerContactKeys'

export function useDeleteContact() {
  const queryClient = useQueryClient()

  return useMutation<null, ApiError, { id: string; customerId: string }>({
    mutationFn: async ({ id }) => {
      await deleteCustomerContact(id)
      return null
    },
    onSuccess: (_data, variables) => {
      queryClient.removeQueries({
        queryKey: contactDetailQueryKey(variables.id),
      })
      void queryClient.invalidateQueries({
        queryKey: customerContactsQueryKey(variables.customerId),
      })
      void queryClient.invalidateQueries({
        queryKey: globalContactsQueryKey(),
      })
      toast.success('Contact deleted successfully.')
    },
  })
}
