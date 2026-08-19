import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SelectField } from '@/components/ui/select-field'
import { CustomerContactForm } from '@/features/customers/contacts/components/CustomerContactForm'
import { useCreateContact } from '@/features/customers/contacts/hooks/useCreateContact'
import { useUpdateContact } from '@/features/customers/contacts/hooks/useUpdateContact'
import type { CustomerContactFormValues } from '@/features/customers/contacts/schemas/customerContact.schema'
import type { CustomerContact } from '@/features/customers/contacts/types/customerContact.types'
import type { Customer } from '@/features/customers/types/customer.types'

export function GlobalContactDialog({
  contact,
  customers,
  customerNames,
  open,
  onOpenChange,
}: {
  contact: CustomerContact | null
  customers: Customer[]
  customerNames: Map<string, string>
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const create = useCreateContact()
  const update = useUpdateContact()
  const mutation = contact ? update : create
  const isEdit = Boolean(contact)
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [customerError, setCustomerError] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (open && !contact) {
      setSelectedCustomerId('')
      setCustomerError(undefined)
    }
  }, [open, contact])

  const handleSubmit = (values: CustomerContactFormValues) => {
    const handleSuccess = () => onOpenChange(false)

    if (contact) {
      update.mutate({ id: contact._id, values }, { onSuccess: handleSuccess })
      return
    }

    if (!selectedCustomerId) {
      setCustomerError('Customer is required')
      return
    }

    create.mutate(
      { customerId: selectedCustomerId, values },
      { onSuccess: handleSuccess }
    )
  }

  const existingCustomerName = contact
    ? customerNames.get(contact.customer)
    : undefined

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
              : 'Add a new contact to your workspace.'}
          </DialogDescription>
        </DialogHeader>

        {isEdit ? (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Customer</span>
            <div className="rounded-lg border border-input bg-muted/40 px-2.5 py-2 text-sm text-muted-foreground">
              {existingCustomerName ?? '—'}
            </div>
          </div>
        ) : (
          <SelectField
            id="customer"
            label="Customer"
            error={customerError}
            value={selectedCustomerId}
            onChange={(event) => {
              setSelectedCustomerId(event.target.value)
              setCustomerError(undefined)
            }}
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.companyName}
              </option>
            ))}
          </SelectField>
        )}

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