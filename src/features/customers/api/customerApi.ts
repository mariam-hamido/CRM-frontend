import { apiClient } from '@/api/client'
import { CUSTOMERS } from '@/api/endpoints'
import type {
  CreateCustomerPayload,
  CustomerListParams,
  CustomerListResponse,
  CustomerResponse,
  DeleteCustomerResponse,
  UpdateCustomerPayload,
} from '@/features/customers/types/customer.types'

export async function getCustomers(
  params: CustomerListParams = {}
): Promise<CustomerListResponse> {
  const response = await apiClient.get<CustomerListResponse>(CUSTOMERS.BASE, {
    params,
  })
  return response.data
}

export async function getCustomer(id: string): Promise<CustomerResponse> {
  const response = await apiClient.get<CustomerResponse>(`${CUSTOMERS.BASE}/${id}`)
  return response.data
}

export async function createCustomer(
  data: CreateCustomerPayload
): Promise<CustomerResponse> {
  const response = await apiClient.post<CustomerResponse>(CUSTOMERS.BASE, data)
  return response.data
}

export async function updateCustomer(
  id: string,
  data: UpdateCustomerPayload
): Promise<CustomerResponse> {
  const response = await apiClient.put<CustomerResponse>(
    `${CUSTOMERS.BASE}/${id}`,
    data
  )
  return response.data
}

export async function deleteCustomer(id: string): Promise<DeleteCustomerResponse> {
  const response = await apiClient.delete<DeleteCustomerResponse>(
    `${CUSTOMERS.BASE}/${id}`
  )
  return response.data
}
