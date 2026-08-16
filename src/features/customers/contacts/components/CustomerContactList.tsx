import { Card } from '@/components/ui/card'
import {
  CustomerContactRow,
  CONTACT_COLUMNS,
  CONTACT_COLUMNS_WITH_CUSTOMER,
} from '@/features/customers/contacts/components/CustomerContactRow'
import type { CustomerContact } from '@/features/customers/contacts/types/customerContact.types'

export function CustomerContactList({
  contacts,
  customerNames,
  onEdit,
  onDelete,
}: {
  contacts: CustomerContact[]
  customerNames?: Map<string, string>
  onEdit: (contact: CustomerContact) => void
  onDelete: (contact: CustomerContact) => void
}) {
  const showCustomer = customerNames !== undefined
  const gridClass = showCustomer ? CONTACT_COLUMNS_WITH_CUSTOMER : CONTACT_COLUMNS

  return (
    <Card>
      <div
        className={`hidden gap-4 border-b px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-6 md:grid ${gridClass}`}
      >
        {showCustomer ? <span>Customer</span> : null}
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
            customerName={
              customerNames !== undefined
                ? customerNames.get(contact.customer)
                : undefined
            }
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </Card>
  )
}
