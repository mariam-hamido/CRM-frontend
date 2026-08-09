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
  onDeleted,
}: {
  deal: Deal | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
}) {
  const deleteDeal = useDeleteDeal()

  const handleDelete = () => {
    if (!deal) return
    deleteDeal.mutate(deal._id, {
      onSuccess: () => {
        onDeleted?.()
        onOpenChange(false)
      },
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
            ? This will remove this deal from your pipeline.
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
