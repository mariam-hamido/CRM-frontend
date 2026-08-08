import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { updateCustomerContact } from '@/features/customers/contacts/api/customerContactApi'
import {
  contactsQueryKey,
  contactDetailQueryKey,
} from '@/features/customers/contacts/hooks/customerContactKeys'
import type { CustomerContactFormValues } from '@/features/customers/contacts/schemas/customerContact.schema'
import type { CustomerContact } from '@/features/customers/contacts/types/customerContact.types'
import {
  toUpdateContactPayload,
} from '@/features/customers/contacts/utils/customerContactUtils'

export function useUpdateContact() {
  const queryClient = useQueryClient()

  return useMutation<
    CustomerContact,
    ApiError,
    { id: string; values: CustomerContactFormValues }
  >({
    mutationFn: async ({ id, values }) => {
      const payload = toUpdateContactPayload(values)
      const response = await updateCustomerContact(id, payload)
      return response.data
    },
    onSuccess: (contact) => {
      queryClient.setQueryData<CustomerContact>(
        contactDetailQueryKey(contact._id),
        contact
      )
      void queryClient.invalidateQueries({ queryKey: contactsQueryKey })
      toast.success('Contact updated successfully.')
    },
  })
}
