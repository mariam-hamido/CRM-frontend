import { ShieldAlert } from 'lucide-react'
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
import { useRemoveInvitation } from '@/features/invitations/hooks/useRemoveInvitation'
import type { Invitation } from '@/features/invitations/types/invitation.types'

export function RemoveInvitationDialog({
  invitation,
  open,
  onOpenChange,
}: {
  invitation: Invitation | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const removeInvitation = useRemoveInvitation()

  const handleRemove = () => {
    if (!invitation) return
    removeInvitation.mutate(invitation, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Remove invitation</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove the invitation for{' '}
            <span className="font-medium text-foreground">
              {invitation?.email ?? 'this email'}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
          <ShieldAlert
            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <ul className="list-disc space-y-1 pl-4">
            <li>This email will no longer be allowed to register as an employee.</li>
            <li>An invitation is an allowlist entry - not a user account.</li>
            <li>Employees who already registered are unaffected.</li>
          </ul>
        </div>

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
            isLoading={removeInvitation.isPending}
            loadingText="Removing…"
            disabled={!invitation}
            onClick={handleRemove}
          >
            Remove invitation
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
