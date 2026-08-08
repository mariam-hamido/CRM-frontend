import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { GENERIC_API_ERROR_MESSAGE } from '@/api/interceptors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { SelectField } from '@/components/ui/select-field'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { CustomerContactDeleteDialog } from '@/features/customers/contacts/components/CustomerContactDeleteDialog'
import { CustomerContactDialog } from '@/features/customers/contacts/components/CustomerContactDialog'
import { CustomerContactEmpty } from '@/features/customers/contacts/components/CustomerContactEmpty'
import { CustomerContactError } from '@/features/customers/contacts/components/CustomerContactError'
import { CustomerContactList } from '@/features/customers/contacts/components/CustomerContactList'
import { CustomerContactLoading } from '@/features/customers/contacts/components/CustomerContactLoading'
import { useCustomerContacts } from '@/features/customers/contacts/hooks/useCustomerContacts'
import type { CustomerContact } from '@/features/customers/contacts/types/customerContact.types'

const PAGE_SIZE = 10

type PrimaryFilter = 'all' | 'primary'

export function CustomerContactsSection({
  customerId,
}: {
  customerId: string
}) {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [primaryFilter, setPrimaryFilter] = useState<PrimaryFilter>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<CustomerContact | null>(
    null
  )
  const [contactToDelete, setContactToDelete] =
    useState<CustomerContact | null>(null)

  const search = useDebouncedValue(searchInput, 300)

  useEffect(() => {
    setPage(1)
  }, [search, primaryFilter])

  const contactsQuery = useCustomerContacts(customerId, {
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    isPrimary: primaryFilter === 'primary' ? true : undefined,
  })

  const contacts = contactsQuery.data?.contacts ?? []
  const pagination = contactsQuery.data?.pagination
  const totalContacts = pagination?.total ?? contacts.length

  const openCreateDialog = () => {
    setEditingContact(null)
    setFormOpen(true)
  }

  const openEditDialog = (contact: CustomerContact) => {
    setEditingContact(contact)
    setFormOpen(true)
  }

  return (
    <section aria-label="Contacts" className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Contacts
          </h2>
          <p className="text-sm text-muted-foreground">
            {totalContacts} {totalContacts === 1 ? 'contact' : 'contacts'}
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
        />
      )}

      {pagination ? (
        <Pagination pagination={pagination} onPageChange={setPage} />
      ) : null}

      <CustomerContactDialog
        customerId={customerId}
        contact={editingContact}
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
    </section>
  )
}
