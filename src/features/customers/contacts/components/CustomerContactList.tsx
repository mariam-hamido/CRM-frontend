import { Card } from '@/components/ui/card'
import { CustomerContactRow, CONTACT_COLUMNS } from '@/features/customers/contacts/components/CustomerContactRow'
import type { CustomerContact } from '@/features/customers/contacts/types/customerContact.types'

export function CustomerContactList({
  contacts,
  onEdit,
  onDelete,
}: {
  contacts: CustomerContact[]
  onEdit: (contact: CustomerContact) => void
  onDelete: (contact: CustomerContact) => void
}) {
  return (
    <Card>
      <div
        className={`hidden gap-4 border-b px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-6 md:grid ${CONTACT_COLUMNS}`}
      >
        <span>Name</span>
        <span>Job title</span>
        <span className="hidden lg:block">Email</span>
        <span className="hidden xl:block">Phone</span>
        <span>Primary</span>
        <span className="text-right">
          <span className="sr-only">Actions</span>
        </span>
      </div>
      <ul>
        {contacts.map((contact) => (
          <CustomerContactRow
            key={contact._id}
            contact={contact}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </Card>
  )
}
