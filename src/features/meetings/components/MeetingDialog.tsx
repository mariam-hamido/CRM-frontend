import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  MeetingForm,
  type MeetingFormValues,
} from '@/features/meetings/components/MeetingForm'
import { useCreateMeeting } from '@/features/meetings/hooks/useCreateMeeting'
import { useUpdateMeeting } from '@/features/meetings/hooks/useUpdateMeeting'
import type {
  MeetingCreateFormValues,
  MeetingUpdateFormValues,
} from '@/features/meetings/schemas/meeting.schema'
import type { Meeting } from '@/features/meetings/types/meeting.types'
import {
  toCreateMeetingPayload,
  toUpdateMeetingPayload,
} from '@/features/meetings/utils/meetingUtils'
import type { Customer } from '@/features/customers/types/customer.types'
import type { Deal } from '@/features/deals/types/deal.types'

export function MeetingDialog({
  meeting,
  open,
  onOpenChange,
  customers,
  deals,
}: {
  meeting: Meeting | null
  open: boolean
  onOpenChange: (open: boolean) => void
  customers: Customer[]
  deals: Deal[]
}) {
  const create = useCreateMeeting()
  const update = useUpdateMeeting()
  const mutation = meeting ? update : create
  const isEdit = Boolean(meeting)

  const handleSubmit = (values: MeetingFormValues) => {
    const handleSuccess = () => onOpenChange(false)

    if (meeting) {
      update.mutate(
        {
          id: meeting._id,
          payload: toUpdateMeetingPayload(values as MeetingUpdateFormValues),
        },
        { onSuccess: handleSuccess }
      )
    } else {
      create.mutate(toCreateMeetingPayload(values as MeetingCreateFormValues), {
        onSuccess: handleSuccess,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit meeting' : 'Add meeting'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the details for this meeting.'
              : 'Schedule a new meeting.'}
          </DialogDescription>
        </DialogHeader>

        <MeetingForm
          meeting={meeting}
          customers={customers}
          deals={deals}
          isPending={mutation.isPending}
          serverError={mutation.error?.message}
          submitLabel={isEdit ? 'Save changes' : 'Add meeting'}
          loadingLabel={isEdit ? 'Saving…' : 'Adding…'}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
