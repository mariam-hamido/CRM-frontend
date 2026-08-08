import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CustomerSourceBadge } from '@/features/customers/components/CustomerSourceBadge'
import { CustomerStatusBadge } from '@/features/customers/components/CustomerStatusBadge'
import type { Customer } from '@/features/customers/types/customer.types'
import {
  formatCount,
  formatDate,
  formatRevenue,
} from '@/features/customers/utils/customerUtils'

export function CustomerTable({
  customers,
  onView,
  onEdit,
  onDelete,
}: {
  customers: Customer[]
  onView: (customer: Customer) => void
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
}) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs tracking-wide text-muted-foreground uppercase">
              <th className="px-4 py-3 font-medium sm:px-6">Company</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">
                Industry
              </th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">
                Email
              </th>
              <th className="hidden px-4 py-3 font-medium xl:table-cell">
                Phone
              </th>
              <th className="px-4 py-3 font-medium sm:px-6">Status</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">
                Source
              </th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">
                Revenue
              </th>
              <th className="hidden px-4 py-3 font-medium xl:table-cell">
                Employees
              </th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">
                Created
              </th>
              <th className="px-4 py-3 sm:px-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer._id}
                className="border-b transition-colors last:border-0 hover:bg-muted/50"
              >
                <td className="max-w-56 truncate px-4 py-3 font-medium sm:px-6">
                  {customer.companyName}
                </td>
                <td className="hidden max-w-40 truncate px-4 py-3 text-muted-foreground md:table-cell">
                  {customer.industry ?? '—'}
                </td>
                <td className="hidden max-w-56 truncate px-4 py-3 text-muted-foreground lg:table-cell">
                  {customer.email ?? '—'}
                </td>
                <td className="hidden max-w-40 truncate px-4 py-3 text-muted-foreground xl:table-cell">
                  {customer.phone ?? '—'}
                </td>
                <td className="px-4 py-3 sm:px-6">
                  <CustomerStatusBadge status={customer.status} />
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <CustomerSourceBadge source={customer.source} />
                </td>
                <td className="hidden px-4 py-3 tabular-nums text-muted-foreground lg:table-cell">
                  {formatRevenue(customer.annualRevenue)}
                </td>
                <td className="hidden px-4 py-3 tabular-nums text-muted-foreground xl:table-cell">
                  {formatCount(customer.employeesCount)}
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                  {formatDate(customer.createdAt)}
                </td>
                <td className="px-4 py-3 text-right sm:px-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Actions for ${customer.companyName}`}
                      >
                        <MoreHorizontal aria-hidden="true" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => onView(customer)}>
                        <Eye aria-hidden="true" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onEdit(customer)}>
                        <Pencil aria-hidden="true" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => onDelete(customer)}
                      >
                        <Trash2 aria-hidden="true" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
