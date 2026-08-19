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
import { useDeleteNotification } from '@/features/notifications/hooks/useDeleteNotification'
import type { Notification } from '@/features/notifications/types/notification.types'

export function NotificationDeleteDialog({
  notification,
  open,
  onOpenChange,
}: {
  notification: Notification | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const deleteNotification = useDeleteNotification()

  const handleDelete = () => {
    if (!notification) return
    deleteNotification.mutate(notification._id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete notification</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">
              {notification?.title ?? 'this notification'}
            </span>
            ? This notification will be permanently deleted. This action cannot
            be undone.
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
            isLoading={deleteNotification.isPending}
            loadingText="Deleting…"
            disabled={!notification}
            onClick={handleDelete}
          >
            Delete notification
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}