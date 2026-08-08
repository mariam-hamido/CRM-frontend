import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormErrorMessage, SubmitButton } from '@/features/auth/components'
import {
  customerContactFormSchema,
  type CustomerContactFormValues,
} from '@/features/customers/contacts/schemas/customerContact.schema'
import type { CustomerContact } from '@/features/customers/contacts/types/customerContact.types'
import { contactToFormValues } from '@/features/customers/contacts/utils/customerContactUtils'

const DEFAULT_FORM_VALUES: CustomerContactFormValues = {
  firstName: '',
  lastName: '',
  jobTitle: '',
  email: '',
  phone: '',
  isPrimary: false,
}

export function CustomerContactForm({
  contact,
  isPending,
  serverError,
  submitLabel,
  loadingLabel,
  onCancel,
  onSubmit,
}: {
  contact: CustomerContact | null
  isPending: boolean
  serverError?: string
  submitLabel: string
  loadingLabel: string
  onCancel: () => void
  onSubmit: (values: CustomerContactFormValues) => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CustomerContactFormValues>({
    resolver: zodResolver(customerContactFormSchema),
    mode: 'onTouched',
    defaultValues: DEFAULT_FORM_VALUES,
  })

  useEffect(() => {
    if (contact) {
      reset(contactToFormValues(contact))
    } else {
      reset(DEFAULT_FORM_VALUES)
    }
  }, [contact, reset])

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

        <div className="flex flex-col gap-2">
          <Label htmlFor="jobTitle">
            Job title <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="jobTitle"
            autoComplete="organization-title"
            aria-invalid={errors.jobTitle ? true : undefined}
            aria-describedby={errors.jobTitle ? 'jobTitle-error' : undefined}
            {...register('jobTitle')}
          />
          <FormErrorMessage message={errors.jobTitle?.message} id="jobTitle-error" />
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

        <div className="flex items-center gap-2">
          <input
            id="isPrimary"
            type="checkbox"
            aria-invalid={errors.isPrimary ? true : undefined}
            className="size-4 rounded border-input accent-primary"
            {...register('isPrimary')}
          />
          <Label htmlFor="isPrimary">Primary contact</Label>
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
