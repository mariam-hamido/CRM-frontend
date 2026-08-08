import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { createCustomer } from '@/features/customers/api/customerApi'
import {
  customersQueryKey,
} from '@/features/customers/hooks/useGetCustomers'
import type { CustomerFormValues } from '@/features/customers/schemas/customer.schema'
import type { Customer } from '@/features/customers/types/customer.types'
import {
  getCustomerAuthContext,
  toCustomerPayload,
} from '@/features/customers/utils/customerUtils'

export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation<Customer, ApiError, CustomerFormValues>({
    mutationFn: async (values) => {
      const payload = toCustomerPayload(values, getCustomerAuthContext())
      const response = await createCustomer(payload)
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: customersQueryKey })
      toast.success('Customer created successfully.')
    },
  })
}
