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
import { useDeleteLead } from '@/features/leads/hooks/useDeleteLead'
import type { Lead } from '@/features/leads/types/lead.types'

function leadDisplayName(lead: Lead | null) {
  if (!lead) return ''
  return lead.fullName || `${lead.firstName} ${lead.lastName}`
}

export function LeadDeleteDialog({
  lead,
  open,
  onOpenChange,
}: {
  lead: Lead | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const deleteLead = useDeleteLead()

  const handleDelete = () => {
    if (!lead) return
    deleteLead.mutate(lead._id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete lead</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">
              {leadDisplayName(lead) || 'this lead'}
            </span>
            ? This will permanently remove the lead from your pipeline. This
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
            isLoading={deleteLead.isPending}
            loadingText="Deleting…"
            disabled={!lead}
            onClick={handleDelete}
          >
            Delete lead
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
