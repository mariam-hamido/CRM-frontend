import type { ContactListParams } from '@/features/customers/contacts/types/customerContact.types'

export const contactsQueryKey = ['customer-contacts'] as const

export function contactsListQueryKey(params: ContactListParams = {}) {
  return ['customer-contacts', 'list', params] as const
}

export function customerContactsQueryKey(customerId: string | undefined) {
  return ['customer-contacts', 'customer', customerId] as const
}

export function customerContactsListQueryKey(
  customerId: string | undefined,
  params: ContactListParams = {}
) {
  return [...customerContactsQueryKey(customerId), params] as const
}

export function contactDetailQueryKey(contactId: string | undefined) {
  return ['customer-contacts', 'detail', contactId] as const
}
