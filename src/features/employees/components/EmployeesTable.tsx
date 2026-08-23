import { MoreHorizontal, UserMinus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmployeeStatusBadge } from '@/features/employees/components/EmployeeStatusBadge'
import type { Employee } from '@/features/employees/types/employee.types'
import { formatDate } from '@/features/employees/utils/employeeUtils'

const ROLE_LABELS: Record<Employee['role'], string> = {
  admin: 'Admin',
  manager: 'Manager',
  sales: 'Sales',
}

export function EmployeesTable({
  employees,
  currentUserId,
  onRemove,
}: {
  employees: Employee[]
  currentUserId: string | undefined
  onRemove: (employee: Employee) => void
}) {
  const canRemove = (employee: Employee) =>
    // UX-only guards; the backend remains the authorization boundary.
    employee.isActive &&
    employee.role !== 'admin' &&
    employee._id !== currentUserId

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs tracking-wide text-muted-foreground uppercase">
              <th className="px-4 py-3 font-medium sm:px-6">Name</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">
                Email
              </th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">
                Role
              </th>
              <th className="px-4 py-3 font-medium sm:px-6">Status</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">
                Joined
              </th>
              <th className="px-4 py-3 sm:px-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee._id}
                className="border-b transition-colors last:border-0 hover:bg-muted/50"
              >
                <td className="max-w-56 truncate px-4 py-3 font-medium sm:px-6">
                  {employee.firstName} {employee.lastName}
                </td>
                <td className="hidden max-w-56 truncate px-4 py-3 text-muted-foreground lg:table-cell">
                  {employee.email}
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                  {ROLE_LABELS[employee.role]}
                </td>
                <td className="px-4 py-3 sm:px-6">
                  <EmployeeStatusBadge isActive={employee.isActive} />
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                  {formatDate(employee.createdAt)}
                </td>
                <td className="px-4 py-3 text-right sm:px-6">
                  {canRemove(employee) ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Actions for ${employee.firstName} ${employee.lastName}`}
                        >
                          <MoreHorizontal aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() => onRemove(employee)}
                        >
                          <UserMinus aria-hidden="true" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
