import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { FieldPath } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormErrorMessage, SubmitButton } from '@/features/auth/components'
import { useCreateInvitation } from '@/features/invitations/hooks/useCreateInvitation'
import {
  inviteEmployeeSchema,
  type InviteEmployeeFormValues,
} from '@/features/invitations/schemas/invitation.schema'

const DEFAULT_FORM_VALUES: InviteEmployeeFormValues = {
  email: '',
}

export function InviteEmployeeDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const createInvitation = useCreateInvitation()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<InviteEmployeeFormValues>({
    resolver: zodResolver(inviteEmployeeSchema),
    mode: 'onTouched',
    defaultValues: DEFAULT_FORM_VALUES,
  })

  useEffect(() => {
    if (!open) return
    reset(DEFAULT_FORM_VALUES)
  }, [open, reset])

  useEffect(() => {
    const fieldErrors = createInvitation.error?.fieldErrors
    if (!fieldErrors?.length) return

    for (const { field, message } of fieldErrors) {
      setError(field as FieldPath<InviteEmployeeFormValues>, {
        type: 'server',
        message,
      })
    }
  }, [createInvitation.error, setError])

  const onSubmit = handleSubmit((values) => {
    createInvitation.mutate(values.email, {
      onSuccess: () => onOpenChange(false),
    })
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite employee</DialogTitle>
          <DialogDescription>
            Approve an email so this person can register as an employee of your
            company.
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              autoComplete="email"
              placeholder="colleague@example.com"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'invite-email-error' : undefined}
              {...register('email')}
            />
            <FormErrorMessage
              message={errors.email?.message}
              id="invite-email-error"
            />
          </div>

          {createInvitation.error?.message ? (
            <FormErrorMessage message={createInvitation.error.message} />
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <SubmitButton isLoading={createInvitation.isPending}>
              Add to allowlist
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
