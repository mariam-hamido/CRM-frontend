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
import { useDeleteCustomer } from '@/features/customers/hooks/useDeleteCustomer'
import type { Customer } from '@/features/customers/types/customer.types'

export function DeleteConfirmDialog({
  customer,
  open,
  onOpenChange,
}: {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const deleteCustomer = useDeleteCustomer()

  const handleDelete = () => {
    if (!customer) return
    deleteCustomer.mutate(customer._id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete customer</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">
              {customer?.companyName ?? 'this customer'}
            </span>
            ? This will remove this customer from the active list.
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
            isLoading={deleteCustomer.isPending}
            loadingText="Deleting…"
            disabled={!customer}
            onClick={handleDelete}
          >
            Delete customer
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
