import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { GENERIC_API_ERROR_MESSAGE } from '@/api/interceptors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { SelectField } from '@/components/ui/select-field'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { GlobalContactDialog } from '@/features/contacts/components/GlobalContactDialog'
import { CustomerContactDeleteDialog } from '@/features/customers/contacts/components/CustomerContactDeleteDialog'
import { CustomerContactEmpty } from '@/features/customers/contacts/components/CustomerContactEmpty'
import { CustomerContactError } from '@/features/customers/contacts/components/CustomerContactError'
import { CustomerContactList } from '@/features/customers/contacts/components/CustomerContactList'
import { CustomerContactLoading } from '@/features/customers/contacts/components/CustomerContactLoading'
import { useGlobalContacts } from '@/features/customers/contacts/hooks/useGlobalContacts'
import { useGlobalContactCustomerNames } from '@/features/customers/contacts/hooks/useGlobalContactCustomerNames'
import { useGetCustomers } from '@/features/customers/hooks/useGetCustomers'
import type { CustomerContact } from '@/features/customers/contacts/types/customerContact.types'

const PAGE_SIZE = 10
const LOOKUP_LIMIT = 100

type PrimaryFilter = 'all' | 'primary'

export default function ContactsPage() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [primaryFilter, setPrimaryFilter] = useState<PrimaryFilter>('all')
  const [customerFilter, setCustomerFilter] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<CustomerContact | null>(
    null
  )
  const [contactToDelete, setContactToDelete] =
    useState<CustomerContact | null>(null)

  const search = useDebouncedValue(searchInput, 300)

  useEffect(() => {
    setPage(1)
  }, [search, primaryFilter, customerFilter])

  const contactsQuery = useGlobalContacts({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    isPrimary: primaryFilter === 'primary' ? true : undefined,
    customer: customerFilter || undefined,
  })

  const customersQuery = useGetCustomers({ limit: LOOKUP_LIMIT })
  const customers = customersQuery.data?.customers ?? []

  const contacts = contactsQuery.data?.contacts ?? []
  const pagination = contactsQuery.data?.pagination
  const hasContacts = pagination
    ? pagination.total > 0
    : contacts.length > 0

  const customerNames = useGlobalContactCustomerNames({ contacts, customers })

  const openCreateDialog = () => {
    setEditingContact(null)
    setFormOpen(true)
  }

  const openEditDialog = (contact: CustomerContact) => {
    setEditingContact(contact)
    setFormOpen(true)
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Contacts
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage contacts across all your customers.
          </p>
        </div>
        <Button type="button" onClick={openCreateDialog}>
          <Plus aria-hidden="true" />
          Add contact
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
            placeholder="Search contacts…"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="pl-9"
            aria-label="Search contacts"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SelectField
            id="primary-filter"
            aria-label="Filter by primary contact"
            className="w-44"
            value={primaryFilter}
            onChange={(event) =>
              setPrimaryFilter(event.target.value as PrimaryFilter)
            }
          >
            <option value="all">All contacts</option>
            <option value="primary">Primary only</option>
          </SelectField>

          <SelectField
            id="customer-filter"
            aria-label="Filter by customer"
            className="w-56"
            value={customerFilter}
            onChange={(event) => setCustomerFilter(event.target.value)}
          >
            <option value="">All customers</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.companyName}
              </option>
            ))}
          </SelectField>
        </div>
      </div>

      {contactsQuery.isPending ? (
        <CustomerContactLoading />
      ) : contactsQuery.isError ? (
        <CustomerContactError
          message={contactsQuery.error?.message ?? GENERIC_API_ERROR_MESSAGE}
          onRetry={() => void contactsQuery.refetch()}
        />
      ) : contacts.length === 0 ? (
        <CustomerContactEmpty onAdd={openCreateDialog} />
      ) : (
        <CustomerContactList
          contacts={contacts}
          onEdit={openEditDialog}
          onDelete={setContactToDelete}
          showCustomer
          customerNames={customerNames}
        />
      )}

      {hasContacts && pagination ? (
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          itemLabel="contacts"
        />
      ) : null}

      <GlobalContactDialog
        contact={editingContact}
        customers={customers}
        customerNames={customerNames}
        open={formOpen}
        onOpenChange={setFormOpen}
      />

      <CustomerContactDeleteDialog
        contact={contactToDelete}
        open={Boolean(contactToDelete)}
        onOpenChange={(open) => {
          if (!open) setContactToDelete(null)
        }}
      />
    </div>
  )
}