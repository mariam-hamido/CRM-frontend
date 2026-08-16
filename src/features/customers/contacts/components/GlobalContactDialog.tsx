import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
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
  open,
  onOpenChange,
}: {
  contact: CustomerContact | null
  customers: Customer[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const create = useCreateContact()
  const update = useUpdateContact()
  const mutation = contact ? update : create
  const isEdit = Boolean(contact)

  const handleSubmit = (values: CustomerContactFormValues) => {
    const handleSuccess = () => {
      onOpenChange(false)
      if (!isEdit) setSelectedCustomer('')
    }

    if (contact) {
      update.mutate(
        { id: contact._id, values },
        { onSuccess: handleSuccess }
      )
    } else {
      if (!selectedCustomer) return
      create.mutate(
        { customerId: selectedCustomer, values },
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
              : 'Add a new contact to a customer.'}
          </DialogDescription>
        </DialogHeader>

        {!isEdit ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor="customer-select">Customer</Label>
            <SelectField
              id="customer-select"
              value={selectedCustomer}
              onChange={(event) => setSelectedCustomer(event.target.value)}
              aria-label="Select a customer"
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.companyName}
                </option>
              ))}
            </SelectField>
          </div>
        ) : null}

        <CustomerContactForm
          contact={contact}
          isPending={mutation.isPending}
          serverError={mutation.error?.message}
          submitLabel={isEdit ? 'Save changes' : 'Add contact'}
          loadingLabel={isEdit ? 'Saving…' : 'Adding…'}
          onCancel={() => {
            onOpenChange(false)
            if (!isEdit) setSelectedCustomer('')
          }}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
