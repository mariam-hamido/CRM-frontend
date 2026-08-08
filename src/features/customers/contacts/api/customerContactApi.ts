import { apiClient } from '@/api/client'
import { CUSTOMER_CONTACTS } from '@/api/endpoints'
import type {
  ContactListParams,
  ContactListResponse,
  ContactResponse,
  CreateContactPayload,
  DeleteContactResponse,
  UpdateContactPayload,
} from '@/features/customers/contacts/types/customerContact.types'

export async function createCustomerContact(
  data: CreateContactPayload
): Promise<ContactResponse> {
  const response = await apiClient.post<ContactResponse>(
    CUSTOMER_CONTACTS.BASE,
    data
  )
  return response.data
}

export async function getCustomerContacts(
  params: ContactListParams = {}
): Promise<ContactListResponse> {
  const response = await apiClient.get<ContactListResponse>(
    CUSTOMER_CONTACTS.BASE,
    { params }
  )
  return response.data
}

export async function getCustomerContactsByCustomer(
  customerId: string,
  params: ContactListParams = {}
): Promise<ContactListResponse> {
  const response = await apiClient.get<ContactListResponse>(
    `${CUSTOMER_CONTACTS.BASE}/customer/${customerId}`,
    { params }
  )
  return response.data
}

export async function getCustomerContact(
  id: string
): Promise<ContactResponse> {
  const response = await apiClient.get<ContactResponse>(
    `${CUSTOMER_CONTACTS.BASE}/${id}`
  )
  return response.data
}

export async function updateCustomerContact(
  id: string,
  data: UpdateContactPayload
): Promise<ContactResponse> {
  const response = await apiClient.put<ContactResponse>(
    `${CUSTOMER_CONTACTS.BASE}/${id}`,
    data
  )
  return response.data
}

export async function deleteCustomerContact(
  id: string
): Promise<DeleteContactResponse> {
  const response = await apiClient.delete<DeleteContactResponse>(
    `${CUSTOMER_CONTACTS.BASE}/${id}`
  )
  return response.data
}
