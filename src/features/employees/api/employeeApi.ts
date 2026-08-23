import { apiClient } from '@/api/client'
import { EMPLOYEES } from '@/api/endpoints'
import type {
  EmployeeListParams,
  EmployeeListResponse,
  EmployeeResponse,
} from '@/features/employees/types/employee.types'

export async function getEmployees(
  params: EmployeeListParams = {}
): Promise<EmployeeListResponse> {
  const response = await apiClient.get<EmployeeListResponse>(EMPLOYEES.BASE, {
    params,
  })
  return response.data
}

export async function removeEmployee(id: string): Promise<EmployeeResponse> {
  const response = await apiClient.patch<EmployeeResponse>(
    EMPLOYEES.REMOVE(id)
  )
  return response.data
}
