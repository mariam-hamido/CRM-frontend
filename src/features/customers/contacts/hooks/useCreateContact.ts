import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { createCustomerContact } from '@/features/customers/contacts/api/customerContactApi'
import {
  contactsQueryKey,
} from '@/features/customers/contacts/hooks/customerContactKeys'
import type { CustomerContactFormValues } from '@/features/customers/contacts/schemas/customerContact.schema'
import type { CustomerContact } from '@/features/customers/contacts/types/customerContact.types'
import {
  toCreateContactPayload,
} from '@/features/customers/contacts/utils/customerContactUtils'

export function useCreateContact() {
  const queryClient = useQueryClient()

  return useMutation<
    CustomerContact,
    ApiError,
    { customerId: string; values: CustomerContactFormValues }
  >({
    mutationFn: async ({ customerId, values }) => {
      const payload = toCreateContactPayload(values, customerId)
      const response = await createCustomerContact(payload)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contactsQueryKey })
      toast.success('Contact created successfully.')
    },
  })
}
