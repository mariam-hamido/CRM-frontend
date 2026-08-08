import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SelectField } from '@/components/ui/select-field'
import { FormErrorMessage, SubmitButton } from '@/features/auth/components'
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
} from '@/features/leads/constants/leadLabels'
import {
  leadFormSchema,
  type LeadFormValues,
} from '@/features/leads/schemas/lead.schema'
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
  type Lead,
} from '@/features/leads/types/lead.types'
import { leadToFormValues } from '@/features/leads/utils/leadUtils'

const DEFAULT_FORM_VALUES: LeadFormValues = {
  firstName: '',
  lastName: '',
  companyName: '',
  email: '',
  phone: '',
  status: 'new',
  source: 'other',
  score: '',
  estimatedValue: '',
  notes: '',
}

export function LeadForm({
  lead,
  isPending,
  serverError,
  submitLabel,
  loadingLabel,
  onCancel,
  onSubmit,
}: {
  lead: Lead | null
  isPending: boolean
  serverError?: string
  submitLabel: string
  loadingLabel: string
  onCancel: () => void
  onSubmit: (values: LeadFormValues) => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    mode: 'onTouched',
    defaultValues: DEFAULT_FORM_VALUES,
  })

  useEffect(() => {
    if (lead) {
      reset(leadToFormValues(lead))
    } else {
      reset(DEFAULT_FORM_VALUES)
    }
  }, [lead, reset])

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            autoComplete="given-name"
            aria-invalid={errors.firstName ? true : undefined}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            {...register('firstName')}
          />
          <FormErrorMessage message={errors.firstName?.message} id="firstName-error" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            autoComplete="family-name"
            aria-invalid={errors.lastName ? true : undefined}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            {...register('lastName')}
          />
          <FormErrorMessage message={errors.lastName?.message} id="lastName-error" />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="companyName">
            Company name <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="companyName"
            autoComplete="organization"
            aria-invalid={errors.companyName ? true : undefined}
            aria-describedby={
              errors.companyName ? 'companyName-error' : undefined
            }
            {...register('companyName')}
          />
          <FormErrorMessage
            message={errors.companyName?.message}
            id="companyName-error"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">
            Email <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          <FormErrorMessage message={errors.email?.message} id="email-error" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">
            Phone <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            {...register('phone')}
          />
          <FormErrorMessage message={errors.phone?.message} id="phone-error" />
        </div>

        <SelectField
          id="status"
          label="Status"
          error={errors.status?.message}
          {...register('status')}
        >
          {LEAD_STATUSES.map((status) => (
            <option key={status} value={status}>
              {LEAD_STATUS_LABELS[status]}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="source"
          label="Source"
          error={errors.source?.message}
          {...register('source')}
        >
          {LEAD_SOURCES.map((source) => (
            <option key={source} value={source}>
              {LEAD_SOURCE_LABELS[source]}
            </option>
          ))}
        </SelectField>

        <div className="flex flex-col gap-2">
          <Label htmlFor="score">
            Score <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="score"
            type="number"
            min="0"
            max="100"
            step="1"
            inputMode="numeric"
            placeholder="70"
            aria-invalid={errors.score ? true : undefined}
            aria-describedby={errors.score ? 'score-error' : undefined}
            {...register('score')}
          />
          <FormErrorMessage message={errors.score?.message} id="score-error" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="estimatedValue">
            Estimated value <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="estimatedValue"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            placeholder="25000"
            aria-invalid={errors.estimatedValue ? true : undefined}
            aria-describedby={
              errors.estimatedValue ? 'estimatedValue-error' : undefined
            }
            {...register('estimatedValue')}
          />
          <FormErrorMessage
            message={errors.estimatedValue?.message}
            id="estimatedValue-error"
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="notes">
            Notes <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="notes"
            aria-invalid={errors.notes ? true : undefined}
            aria-describedby={errors.notes ? 'notes-error' : undefined}
            {...register('notes')}
          />
          <FormErrorMessage message={errors.notes?.message} id="notes-error" />
        </div>
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
