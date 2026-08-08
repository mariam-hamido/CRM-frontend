import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getCustomerContactsByCustomer } from '@/features/customers/contacts/api/customerContactApi'
import {
  customerContactsListQueryKey,
} from '@/features/customers/contacts/hooks/customerContactKeys'
import type {
  ContactListData,
  ContactListParams,
} from '@/features/customers/contacts/types/customerContact.types'

export function useCustomerContacts(
  customerId: string | undefined,
  params: ContactListParams = {}
) {
  return useQuery<ContactListData, ApiError>({
    queryKey: customerContactsListQueryKey(customerId, params),
    queryFn: async () => {
      if (!customerId) throw new Error('Customer ID is required')
      const response = await getCustomerContactsByCustomer(customerId, params)
      return response.data
    },
    enabled: Boolean(customerId),
  })
}
