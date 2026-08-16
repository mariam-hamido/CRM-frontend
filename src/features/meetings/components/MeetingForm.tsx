import { useEffect } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SelectField } from '@/components/ui/select-field'
import { FormErrorMessage, SubmitButton } from '@/features/auth/components'
import {
  MEETING_TYPE_LABELS,
} from '@/features/meetings/constants/meetingLabels'
import {
  meetingCreateSchema,
  meetingUpdateSchema,
  type MeetingCreateFormValues,
  type MeetingUpdateFormValues,
} from '@/features/meetings/schemas/meeting.schema'
import {
  MEETING_STATUSES,
  MEETING_TYPES,
  type Meeting,
} from '@/features/meetings/types/meeting.types'
import {
  DEFAULT_MEETING_FORM_VALUES,
  meetingToFormValues,
} from '@/features/meetings/utils/meetingUtils'
import type { Customer } from '@/features/customers/types/customer.types'
import type { Deal } from '@/features/deals/types/deal.types'

export type MeetingFormValues = MeetingCreateFormValues | MeetingUpdateFormValues

type MeetingFormFieldValues = MeetingCreateFormValues & MeetingUpdateFormValues

export function MeetingForm({
  meeting,
  customers,
  deals,
  isPending,
  serverError,
  submitLabel,
  loadingLabel,
  onCancel,
  onSubmit,
}: {
  meeting: Meeting | null
  customers: Customer[]
  deals: Deal[]
  isPending: boolean
  serverError?: string
  submitLabel: string
  loadingLabel: string
  onCancel: () => void
  onSubmit: (values: MeetingFormValues) => void
}) {
  const isEdit = Boolean(meeting)
  const schema = isEdit ? meetingUpdateSchema : meetingCreateSchema

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<MeetingFormFieldValues>({
    resolver: zodResolver(schema) as Resolver<MeetingFormFieldValues>,
    mode: 'onTouched',
    defaultValues: DEFAULT_MEETING_FORM_VALUES,
  })

  useEffect(() => {
    if (meeting) {
      reset(meetingToFormValues(meeting))
    } else {
      reset(DEFAULT_MEETING_FORM_VALUES)
    }
  }, [meeting, reset])

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            autoComplete="off"
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={errors.title ? 'title-error' : undefined}
            {...register('title')}
          />
          <FormErrorMessage message={errors.title?.message} id="title-error" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="meetingDate">Date and time</Label>
          <Input
            id="meetingDate"
            type="datetime-local"
            aria-invalid={errors.meetingDate ? true : undefined}
            aria-describedby={
              errors.meetingDate ? 'meetingDate-error' : undefined
            }
            {...register('meetingDate')}
          />
          <FormErrorMessage
            message={errors.meetingDate?.message}
            id="meetingDate-error"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="duration">
            Duration (minutes){' '}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="duration"
            type="number"
            min="1"
            step="1"
            aria-invalid={errors.duration ? true : undefined}
            aria-describedby={
              errors.duration ? 'duration-error' : undefined
            }
            {...register('duration')}
          />
          <FormErrorMessage
            message={errors.duration?.message}
            id="duration-error"
          />
        </div>

        <SelectField
          id="meetingType"
          label="Meeting type"
          error={errors.meetingType?.message}
          {...register('meetingType')}
        >
          {MEETING_TYPES.map((type) => (
            <option key={type} value={type}>
              {MEETING_TYPE_LABELS[type]}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="customer"
          label="Customer"
          error={errors.customer?.message}
          {...register('customer')}
        >
          <option value="">Select a customer</option>
          {customers.map((customer) => (
            <option key={customer._id} value={customer._id}>
              {customer.companyName}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="deal"
          label="Deal"
          error={errors.deal?.message}
          {...register('deal')}
        >
          <option value="">No deal</option>
          {deals.map((deal) => (
            <option key={deal._id} value={deal._id}>
              {deal.title}
            </option>
          ))}
        </SelectField>

        <div className="flex flex-col gap-2">
          <Label htmlFor="location">
            Location{' '}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="location"
            aria-invalid={errors.location ? true : undefined}
            aria-describedby={
              errors.location ? 'location-error' : undefined
            }
            {...register('location')}
          />
          <FormErrorMessage
            message={errors.location?.message}
            id="location-error"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="meetingLink">
            Meeting link{' '}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="meetingLink"
            aria-invalid={errors.meetingLink ? true : undefined}
            aria-describedby={
              errors.meetingLink ? 'meetingLink-error' : undefined
            }
            {...register('meetingLink')}
          />
          <FormErrorMessage
            message={errors.meetingLink?.message}
            id="meetingLink-error"
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="description">
            Description{' '}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="description"
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={
              errors.description ? 'description-error' : undefined
            }
            {...register('description')}
          />
          <FormErrorMessage
            message={errors.description?.message}
            id="description-error"
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="notes">
            Notes{' '}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="notes"
            aria-invalid={errors.notes ? true : undefined}
            aria-describedby={errors.notes ? 'notes-error' : undefined}
            {...register('notes')}
          />
          <FormErrorMessage
            message={errors.notes?.message}
            id="notes-error"
          />
        </div>

        {isEdit ? (
          <SelectField
            id="status"
            label="Status"
            error={errors.status?.message}
            {...register('status')}
          >
            {MEETING_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status === 'scheduled'
                  ? 'Scheduled'
                  : status === 'completed'
                    ? 'Completed'
                    : status === 'cancelled'
                      ? 'Cancelled'
                      : 'No show'}
              </option>
            ))}
          </SelectField>
        ) : null}
      </div>

      {serverError ? <FormErrorMessage message={serverError} /> : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <SubmitButton
          isLoading={isPending}
          loadingText={loadingLabel}
          disabled={!isDirty}
        >
          {submitLabel}
        </SubmitButton>
      </div>
    </form>
  )
}
