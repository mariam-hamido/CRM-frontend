import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TriangleAlert, UsersRound } from 'lucide-react'
import { GENERIC_API_ERROR_MESSAGE } from '@/api/interceptors'
import { ROUTES } from '@/app/router/routeConstants'
import { Card, CardContent } from '@/components/ui/card'
import { Pagination } from '@/components/ui/pagination'
import { SelectField } from '@/components/ui/select-field'
import { selectUser, useAuthStore } from '@/features/auth/store/authStore'
import {
  EmployeeListError,
  EmployeeListLoading,
  EmployeeRemoveDialog,
  EmployeesTable,
} from '@/features/employees/components'
import { useGetEmployees } from '@/features/employees/hooks/useGetEmployees'
import type {
  Employee,
  EmployeeStatusFilter,
} from '@/features/employees/types/employee.types'

const PAGE_SIZE = 10

export default function EmployeesPage() {
  const currentUser = useAuthStore(selectUser)

  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<EmployeeStatusFilter | ''>('')
  const [employeeToRemove, setEmployeeToRemove] = useState<Employee | null>(
    null
  )

  const employeesQuery = useGetEmployees({
    page,
    limit: PAGE_SIZE,
    status: statusFilter || undefined,
  })

  const employees = employeesQuery.data?.employees ?? []
  const pagination = employeesQuery.data?.pagination
  const hasActiveFilters = Boolean(statusFilter)
  const hasEmployees = pagination ? pagination.total > 0 : employees.length > 0

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Employees
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage the people in your company.
          </p>
          <Link
            to={ROUTES.invitations}
            className="text-sm text-muted-foreground underline-offset-2 hover:underline"
          >
            View invitations →
          </Link>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <SelectField
          id="status-filter"
          aria-label="Filter by status"
          className="w-40"
          value={statusFilter}
          onChange={(event) => {
            setPage(1)
            setStatusFilter(event.target.value as EmployeeStatusFilter | '')
          }}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </SelectField>
      </div>

      {employeesQuery.isPending ? (
        <EmployeeListLoading />
      ) : employeesQuery.isError ? (
        <EmployeeListError
          message={employeesQuery.error?.message ?? GENERIC_API_ERROR_MESSAGE}
          onRetry={() => void employeesQuery.refetch()}
        />
      ) : employees.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              {hasActiveFilters ? (
                <TriangleAlert
                  className="size-5 text-muted-foreground"
                  aria-hidden="true"
                />
              ) : (
                <UsersRound
                  className="size-5 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-medium">No employees found</p>
              <p className="text-sm text-muted-foreground">
                {hasActiveFilters
                  ? 'Try adjusting your filters.'
                  : 'Employees who join your company will appear here.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <EmployeesTable
          employees={employees}
          currentUserId={currentUser?._id}
          onRemove={setEmployeeToRemove}
        />
      )}

      {hasEmployees && pagination ? (
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          itemLabel="employees"
        />
      ) : null}

      <EmployeeRemoveDialog
        open={Boolean(employeeToRemove)}
        onOpenChange={(open) => {
          if (!open) setEmployeeToRemove(null)
        }}
        employee={employeeToRemove}
      />
    </div>
  )
}
