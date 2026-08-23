import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/api/interceptors'
import { getEmployees } from '@/features/employees/api/employeeApi'
import type {
  EmployeeListData,
  EmployeeListParams,
} from '@/features/employees/types/employee.types'
import { employeesListQueryKey } from '@/features/employees/hooks/employeeKeys'

export function useGetEmployees(params: EmployeeListParams = {}) {
  return useQuery<EmployeeListData, ApiError>({
    queryKey: employeesListQueryKey(params),
    queryFn: async () => {
      const response = await getEmployees(params)
      return response.data
    },
  })
}
