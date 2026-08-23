import type { EmployeeListParams } from '@/features/employees/types/employee.types'

export const employeesQueryKey = ['employees'] as const

export function employeesListQueryKey(params: EmployeeListParams = {}) {
  return ['employees', 'list', params] as const
}
