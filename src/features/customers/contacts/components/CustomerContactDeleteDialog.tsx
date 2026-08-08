import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SubmitButton } from '@/features/auth/components'
import { useDeleteContact } from '@/features/customers/contacts/hooks/useDeleteContact'
import type { CustomerContact } from '@/features/customers/contacts/types/customerContact.types'

function contactDisplayName(contact: CustomerContact | null) {
  if (!contact) return ''
  return contact.fullName || `${contact.firstName} ${contact.lastName}`
}

export function CustomerContactDeleteDialog({
  contact,
  open,
  onOpenChange,
}: {
  contact: CustomerContact | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const deleteContact = useDeleteContact()

  const handleDelete = () => {
    if (!contact) return
    deleteContact.mutate(contact._id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete contact</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">
              {contactDisplayName(contact) || 'this contact'}
            </span>
            ? This will permanently remove the contact record from the
            customer. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <SubmitButton
            variant="destructive"
            isLoading={deleteContact.isPending}
            loadingText="Deleting…"
            disabled={!contact}
            onClick={handleDelete}
          >
            Delete contact
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
