import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CustomerContactForm } from '@/features/customers/contacts/components/CustomerContactForm'
import { useCreateContact } from '@/features/customers/contacts/hooks/useCreateContact'
import { useUpdateContact } from '@/features/customers/contacts/hooks/useUpdateContact'
import type { CustomerContactFormValues } from '@/features/customers/contacts/schemas/customerContact.schema'
import type { CustomerContact } from '@/features/customers/contacts/types/customerContact.types'

export function CustomerContactDialog({
  customerId,
  contact,
  open,
  onOpenChange,
}: {
  customerId: string
  contact: CustomerContact | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const create = useCreateContact()
  const update = useUpdateContact()
  const mutation = contact ? update : create
  const isEdit = Boolean(contact)

  const handleSubmit = (values: CustomerContactFormValues) => {
    const handleSuccess = () => onOpenChange(false)

    if (contact) {
      update.mutate(
        { id: contact._id, values },
        { onSuccess: handleSuccess }
      )
    } else {
      create.mutate(
        { customerId, values },
        { onSuccess: handleSuccess }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit contact' : 'Add contact'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the details for this contact.'
              : 'Add a new contact to this customer.'}
          </DialogDescription>
        </DialogHeader>

        <CustomerContactForm
          contact={contact}
          isPending={mutation.isPending}
          serverError={mutation.error?.message}
          submitLabel={isEdit ? 'Save changes' : 'Add contact'}
          loadingLabel={isEdit ? 'Saving…' : 'Adding…'}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
