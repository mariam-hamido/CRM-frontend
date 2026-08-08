import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { deleteCustomer } from '@/features/customers/api/customerApi'
import { customersQueryKey } from '@/features/customers/hooks/useGetCustomers'

export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation<null, ApiError, string>({
    mutationFn: async (id) => {
      await deleteCustomer(id)
      return null
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: customersQueryKey })
      toast.success('Customer deleted successfully.')
    },
  })
}
