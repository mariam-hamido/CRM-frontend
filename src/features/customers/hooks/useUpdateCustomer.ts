import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { updateCustomer } from '@/features/customers/api/customerApi'
import {
  customersQueryKey,
  customerDetailQueryKey,
} from '@/features/customers/hooks/useGetCustomers'
import type { CustomerFormValues } from '@/features/customers/schemas/customer.schema'
import type { Customer } from '@/features/customers/types/customer.types'
import {
  getCustomerAuthContext,
  toCustomerPayload,
} from '@/features/customers/utils/customerUtils'

export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation<Customer, ApiError, { id: string; values: CustomerFormValues }>({
    mutationFn: async ({ id, values }) => {
      const payload = toCustomerPayload(values, getCustomerAuthContext())
      const response = await updateCustomer(id, payload)
      return response.data
    },
    onSuccess: (customer) => {
      queryClient.setQueryData<Customer>(
        customerDetailQueryKey(customer._id),
        customer
      )
      void queryClient.invalidateQueries({ queryKey: customersQueryKey })
      toast.success('Customer updated successfully.')
    },
  })
}
