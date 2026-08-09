import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, TriangleAlert, Users } from 'lucide-react'
import { GENERIC_API_ERROR_MESSAGE } from '@/api/interceptors'
import { ROUTES } from '@/app/router/routeConstants'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { SelectField } from '@/components/ui/select-field'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import {
  CustomerFormDialog,
  CustomerListError,
  CustomerListLoading,
  CustomerTable,
  DeleteConfirmDialog,
} from '@/features/customers/components'
import {
  CUSTOMER_SOURCE_LABELS,
  CUSTOMER_STATUS_LABELS,
} from '@/features/customers/constants/customerLabels'
import { useGetCustomers } from '@/features/customers/hooks/useGetCustomers'
import {
  CUSTOMER_SOURCES,
  CUSTOMER_STATUSES,
  type Customer,
  type CustomerSource,
  type CustomerStatus,
} from '@/features/customers/types/customer.types'

const PAGE_SIZE = 10

export default function CustomersPage() {
  const navigate = useNavigate()

  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | ''>('')
  const [sourceFilter, setSourceFilter] = useState<CustomerSource | ''>('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  )

  const search = useDebouncedValue(searchInput, 300)

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter, sourceFilter])

  const customersQuery = useGetCustomers({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    status: statusFilter || undefined,
    source: sourceFilter || undefined,
  })

  const customers = customersQuery.data?.customers ?? []
  const pagination = customersQuery.data?.pagination
  const hasActiveFilters = Boolean(
    search || statusFilter || sourceFilter
  )
  const hasCustomers = pagination ? pagination.total > 0 : customers.length > 0

  const openCreateDialog = () => {
    setEditingCustomer(null)
    setFormOpen(true)
  }

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormOpen(true)
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Customers
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage the customers in your workspace.
          </p>
        </div>
        <Button type="button" onClick={openCreateDialog}>
          <Plus aria-hidden="true" />
          Add customer
        </Button>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search by company, email, phone…"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="pl-9"
            aria-label="Search customers"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SelectField
            id="status-filter"
            aria-label="Filter by status"
            className="w-40"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as CustomerStatus | '')
            }
          >
            <option value="">All statuses</option>
            {CUSTOMER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {CUSTOMER_STATUS_LABELS[status]}
              </option>
            ))}
          </SelectField>

          <SelectField
            id="source-filter"
            aria-label="Filter by source"
            className="w-40"
            value={sourceFilter}
            onChange={(event) =>
              setSourceFilter(event.target.value as CustomerSource | '')
            }
          >
            <option value="">All sources</option>
            {CUSTOMER_SOURCES.map((source) => (
              <option key={source} value={source}>
                {CUSTOMER_SOURCE_LABELS[source]}
              </option>
            ))}
          </SelectField>
        </div>
      </div>

      {customersQuery.isPending ? (
        <CustomerListLoading />
      ) : customersQuery.isError ? (
        <CustomerListError
          message={customersQuery.error?.message ?? GENERIC_API_ERROR_MESSAGE}
          onRetry={() => void customersQuery.refetch()}
        />
      ) : customers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              {hasActiveFilters ? (
                <TriangleAlert
                  className="size-5 text-muted-foreground"
                  aria-hidden="true"
                />
              ) : (
                <Users className="size-5 text-muted-foreground" aria-hidden="true" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-medium">
                {hasActiveFilters ? 'No customers found' : 'No customers yet'}
              </p>
              <p className="text-sm text-muted-foreground">
                {hasActiveFilters
                  ? 'Try adjusting your search or filters.'
                  : 'Click “Add customer” to create your first customer.'}
              </p>
            </div>
            {!hasActiveFilters ? (
              <Button type="button" variant="outline" onClick={openCreateDialog}>
                <Plus aria-hidden="true" />
                Add customer
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <CustomerTable
          customers={customers}
          onView={(customer) =>
            navigate(ROUTES.customersDetail.replace(':id', customer._id))
          }
          onEdit={openEditDialog}
          onDelete={setCustomerToDelete}
        />
      )}

      {hasCustomers && pagination ? (
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          itemLabel="customers"
        />
      ) : null}

      <CustomerFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        customer={editingCustomer}
      />

      <DeleteConfirmDialog
        open={Boolean(customerToDelete)}
        onOpenChange={(open) => {
          if (!open) setCustomerToDelete(null)
        }}
        customer={customerToDelete}
      />
    </div>
  )
}
