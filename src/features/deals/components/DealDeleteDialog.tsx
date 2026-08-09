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
import { useDeleteDeal } from '@/features/deals/hooks/useDeleteDeal'
import type { Deal } from '@/features/deals/types/deal.types'

export function DealDeleteDialog({
  deal,
  open,
  onOpenChange,
}: {
  deal: Deal | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const deleteDeal = useDeleteDeal()

  const handleDelete = () => {
    if (!deal) return
    deleteDeal.mutate(deal._id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete deal</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">
              {deal?.title ?? 'this deal'}
            </span>
            ? This will permanently remove the deal from your pipeline. This
            action cannot be undone.
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
            isLoading={deleteDeal.isPending}
            loadingText="Deleting…"
            disabled={!deal}
            onClick={handleDelete}
          >
            Delete deal
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
