import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getCustomerContacts } from '@/features/customers/contacts/api/customerContactApi'
import {
  contactsListQueryKey,
} from '@/features/customers/contacts/hooks/customerContactKeys'
import type {
  ContactListData,
  ContactListParams,
} from '@/features/customers/contacts/types/customerContact.types'

export function useContacts(params: ContactListParams = {}) {
  return useQuery<ContactListData, ApiError>({
    queryKey: contactsListQueryKey(params),
    queryFn: async () => {
      const response = await getCustomerContacts(params)
      return response.data
    },
  })
}
