import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/api/interceptors'
import { removeEmployee } from '@/features/employees/api/employeeApi'
import type { Employee } from '@/features/employees/types/employee.types'
import { employeesQueryKey } from '@/features/employees/hooks/employeeKeys'

export function useRemoveEmployee() {
  const queryClient = useQueryClient()

  return useMutation<Employee, ApiError, string>({
    mutationFn: async (id) => {
      const response = await removeEmployee(id)
      return response.data
    },
    onSuccess: (employee) => {
      void queryClient.invalidateQueries({ queryKey: employeesQueryKey })
      toast.success(
        `${employee.firstName} ${employee.lastName} can no longer access the CRM.`
      )
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
