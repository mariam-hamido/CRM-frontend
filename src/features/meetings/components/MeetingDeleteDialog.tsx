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
import { useDeleteMeeting } from '@/features/meetings/hooks/useDeleteMeeting'
import type { Meeting } from '@/features/meetings/types/meeting.types'

export function MeetingDeleteDialog({
  meeting,
  open,
  onOpenChange,
  onDeleted,
}: {
  meeting: Meeting | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
}) {
  const deleteMeeting = useDeleteMeeting()

  const handleDelete = () => {
    if (!meeting) return
    deleteMeeting.mutate(meeting._id, {
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
          <DialogTitle>Delete meeting</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">
              {meeting?.title ?? 'this meeting'}
            </span>
            ? This action cannot be undone.
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
            isLoading={deleteMeeting.isPending}
            loadingText="Deleting…"
            disabled={!meeting}
            onClick={handleDelete}
          >
            Delete meeting
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
