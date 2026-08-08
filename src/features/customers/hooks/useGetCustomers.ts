import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getCustomer, getCustomers } from '@/features/customers/api/customerApi'
import type {
  Customer,
  CustomerListData,
  CustomerListParams,
} from '@/features/customers/types/customer.types'

export const customersQueryKey = ['customers'] as const

export function customerListQueryKey(params: CustomerListParams = {}) {
  return ['customers', 'list', params] as const
}

export function customerDetailQueryKey(id: string | undefined) {
  return ['customers', 'detail', id] as const
}

export function useGetCustomers(params: CustomerListParams = {}) {
  return useQuery<CustomerListData, ApiError>({
    queryKey: customerListQueryKey(params),
    queryFn: async () => {
      const response = await getCustomers(params)
      return response.data
    },
  })
}

export function useGetCustomer(id: string | undefined) {
  return useQuery<Customer, ApiError>({
    queryKey: customerDetailQueryKey(id),
    queryFn: async () => {
      if (!id) throw new Error('Customer ID is required')
      const response = await getCustomer(id)
      return response.data
    },
    enabled: Boolean(id),
  })
}
