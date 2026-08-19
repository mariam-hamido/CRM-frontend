import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getGlobalCustomerContacts } from '@/features/customers/contacts/api/customerContactApi'
import { globalContactsListQueryKey } from '@/features/customers/contacts/hooks/customerContactKeys'
import type {
  ContactListData,
  ContactListParams,
} from '@/features/customers/contacts/types/customerContact.types'

export function useGlobalContacts(params: ContactListParams = {}) {
  return useQuery<ContactListData, ApiError>({
    queryKey: globalContactsListQueryKey(params),
    queryFn: async () => {
      const response = await getGlobalCustomerContacts(params)
      return response.data
    },
  })
}
