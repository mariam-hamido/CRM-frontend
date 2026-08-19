import type { ContactListParams } from '@/features/customers/contacts/types/customerContact.types'

export function customerContactsQueryKey(customerId: string | undefined) {
  return ['customer-contacts', 'customer', customerId] as const
}

export function customerContactsListQueryKey(
  customerId: string | undefined,
  params: ContactListParams = {}
) {
  return [...customerContactsQueryKey(customerId), params] as const
}

export function globalContactsQueryKey() {
  return ['customer-contacts', 'global'] as const
}

export function globalContactsListQueryKey(
  params: ContactListParams = {}
) {
  return [...globalContactsQueryKey(), params] as const
}

export function contactDetailQueryKey(contactId: string | undefined) {
  return ['customer-contacts', 'detail', contactId] as const
}
