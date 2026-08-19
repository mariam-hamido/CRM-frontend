import { MoreHorizontal, Pencil, Star, StarOff, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { CustomerContactPrimaryBadge } from '@/features/customers/contacts/components/CustomerContactPrimaryBadge'
import { useUpdateContact } from '@/features/customers/contacts/hooks/useUpdateContact'
import type { CustomerContact } from '@/features/customers/contacts/types/customerContact.types'
import { contactToFormValues } from '@/features/customers/contacts/utils/customerContactUtils'

export const CONTACT_COLUMNS =
  'md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,1.2fr)_auto_auto]'

function contactDisplayName(contact: CustomerContact) {
  return contact.fullName || `${contact.firstName} ${contact.lastName}`
}

function ContactActions({
  contact,
  onEdit,
  onDelete,
}: {
  contact: CustomerContact
  onEdit: (contact: CustomerContact) => void
  onDelete: (contact: CustomerContact) => void
}) {
  const update = useUpdateContact()

  const togglePrimary = () => {
    if (update.isPending) return
    const values = contactToFormValues(contact)
    values.isPrimary = !contact.isPrimary
    update.mutate({ id: contact._id, values })
  }

  const name = contactDisplayName(contact)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Actions for ${name}`}
        >
          <MoreHorizontal aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => onEdit(contact)}>
          <Pencil aria-hidden="true" />
          Edit
        </DropdownMenuItem>
        {contact.isPrimary ? (
          <DropdownMenuItem
            onSelect={togglePrimary}
            disabled={update.isPending}
            aria-busy={update.isPending || undefined}
          >
            <StarOff aria-hidden="true" />
            Remove primary
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onSelect={togglePrimary}
            disabled={update.isPending}
            aria-busy={update.isPending || undefined}
          >
            <Star aria-hidden="true" />
            Set as primary
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(contact)}>
          <Trash2 aria-hidden="true" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function CustomerContactRow({
  contact,
  onEdit,
  onDelete,
}: {
  contact: CustomerContact
  onEdit: (contact: CustomerContact) => void
  onDelete: (contact: CustomerContact) => void
}) {
  const name = contactDisplayName(contact)

  return (
    <li className="border-b transition-colors last:border-0 hover:bg-muted/50">
      <div
        className={`hidden gap-4 px-4 py-3 sm:px-6 md:grid ${CONTACT_COLUMNS}`}
      >
        <div className="min-w-0 truncate font-medium">{name}</div>
        <div className="min-w-0 truncate text-muted-foreground">
          {contact.jobTitle ?? '—'}
        </div>
        <div className="hidden min-w-0 truncate text-muted-foreground lg:block">
          {contact.email ?? '—'}
        </div>
        <div className="hidden min-w-0 truncate text-muted-foreground xl:block">
          {contact.phone ?? '—'}
        </div>
        <div>
          <CustomerContactPrimaryBadge isPrimary={contact.isPrimary} />
        </div>
        <div className="flex justify-end">
          <ContactActions contact={contact} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 py-3 sm:px-6 md:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="truncate font-medium">{name}</p>
            {contact.jobTitle ? (
              <p className="truncate text-sm text-muted-foreground">
                {contact.jobTitle}
              </p>
            ) : null}
          </div>
          <ContactActions contact={contact} onEdit={onEdit} onDelete={onDelete} />
        </div>
        {contact.email || contact.phone ? (
          <div className="flex flex-col gap-0.5 text-sm text-muted-foreground">
            {contact.email ? <p className="truncate">{contact.email}</p> : null}
            {contact.phone ? <p className="truncate">{contact.phone}</p> : null}
          </div>
        ) : null}
        <CustomerContactPrimaryBadge isPrimary={contact.isPrimary} />
      </div>
    </li>
  )
}
