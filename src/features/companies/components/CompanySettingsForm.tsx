import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { FieldPath } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  FormErrorMessage,
  SubmitButton,
} from '@/features/auth/components'
import { CompanySelectField } from '@/features/companies/components/CompanySelectField'
import {
  COMPANY_STATUS_LABELS,
  COMPANY_SUBSCRIPTION_PLAN_LABELS,
} from '@/features/companies/constants/companyLabels'
import { useUpdateCompany } from '@/features/companies/hooks/useUpdateCompany'
import {
  companyUpdateSchema,
  toCompanyUpdatePayload,
  type CompanyUpdateFormValues,
} from '@/features/companies/schemas/company.schema'
import {
  COMPANY_STATUSES,
  COMPANY_SUBSCRIPTION_PLANS,
  type Company,
} from '@/features/companies/types/company.types'
import { companyToFormValues } from '@/features/companies/utils/companyUtils'

export function CompanySettingsForm({ company }: { company: Company }) {
  const update = useUpdateCompany()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<CompanyUpdateFormValues>({
    resolver: zodResolver(companyUpdateSchema),
    mode: 'onTouched',
    defaultValues: companyToFormValues(company),
  })

  useEffect(() => {
    reset(companyToFormValues(company))
  }, [company, reset])

  useEffect(() => {
    const fieldErrors = update.error?.fieldErrors
    if (!fieldErrors?.length) return

    for (const { field, message } of fieldErrors) {
      setError(field as FieldPath<CompanyUpdateFormValues>, {
        type: 'server',
        message,
      })
    }
  }, [update.error, setError])

  const onSubmit = handleSubmit((values) => {
    update.mutate(toCompanyUpdatePayload(values), {
      onSuccess: () => {
        toast.success('Company settings updated successfully.')
      },
    })
  })

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Company name</Label>
        <Input
          id="name"
          autoComplete="organization"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? 'name-error' : undefined}
          {...register('name')}
        />
        <FormErrorMessage message={errors.name?.message} id="name-error" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="industry">
            Industry <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="industry"
            autoComplete="organization"
            aria-invalid={errors.industry ? true : undefined}
            aria-describedby={
              errors.industry ? 'industry-error' : undefined
            }
            {...register('industry')}
          />
          <FormErrorMessage
            message={errors.industry?.message}
            id="industry-error"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="website">
            Website <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="website"
            type="url"
            autoComplete="url"
            placeholder="https://example.com"
            aria-invalid={errors.website ? true : undefined}
            aria-describedby={
              errors.website ? 'website-error' : undefined
            }
            {...register('website')}
          />
          <FormErrorMessage
            message={errors.website?.message}
            id="website-error"
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

        <div className="flex flex-col gap-2">
          <Label htmlFor="country">
            Country <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="country"
            autoComplete="country-name"
            aria-invalid={errors.country ? true : undefined}
            aria-describedby={errors.country ? 'country-error' : undefined}
            {...register('country')}
          />
          <FormErrorMessage
            message={errors.country?.message}
            id="country-error"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="city">
            City <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="city"
            autoComplete="address-level2"
            aria-invalid={errors.city ? true : undefined}
            aria-describedby={errors.city ? 'city-error' : undefined}
            {...register('city')}
          />
          <FormErrorMessage message={errors.city?.message} id="city-error" />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="address">
            Address <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="address"
            autoComplete="street-address"
            aria-invalid={errors.address ? true : undefined}
            aria-describedby={errors.address ? 'address-error' : undefined}
            {...register('address')}
          />
          <FormErrorMessage
            message={errors.address?.message}
            id="address-error"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CompanySelectField
          id="subscriptionPlan"
          label="Subscription plan"
          error={errors.subscriptionPlan?.message}
          {...register('subscriptionPlan')}
        >
          {COMPANY_SUBSCRIPTION_PLANS.map((plan) => (
            <option key={plan} value={plan}>
              {COMPANY_SUBSCRIPTION_PLAN_LABELS[plan]}
            </option>
          ))}
        </CompanySelectField>

        <CompanySelectField
          id="status"
          label="Status"
          error={errors.status?.message}
          {...register('status')}
        >
          {COMPANY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {COMPANY_STATUS_LABELS[status]}
            </option>
          ))}
        </CompanySelectField>

        <div className="flex flex-col gap-2">
          <Label htmlFor="timezone">
            Timezone <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="timezone"
            placeholder="UTC"
            aria-invalid={errors.timezone ? true : undefined}
            aria-describedby={
              errors.timezone ? 'timezone-error' : undefined
            }
            {...register('timezone')}
          />
          <FormErrorMessage
            message={errors.timezone?.message}
            id="timezone-error"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="currency">
            Currency <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="currency"
            placeholder="USD"
            aria-invalid={errors.currency ? true : undefined}
            aria-describedby={
              errors.currency ? 'currency-error' : undefined
            }
            {...register('currency')}
          />
          <FormErrorMessage
            message={errors.currency?.message}
            id="currency-error"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="logo">
          Logo URL <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="logo"
          type="url"
          placeholder="https://example.com/logo.png"
          aria-invalid={errors.logo ? true : undefined}
          aria-describedby={errors.logo ? 'logo-error' : undefined}
          {...register('logo')}
        />
        <FormErrorMessage message={errors.logo?.message} id="logo-error" />
      </div>

      {update.error?.message ? (
        <FormErrorMessage message={update.error.message} />
      ) : null}

      <div className="flex justify-end">
        <SubmitButton
          isLoading={update.isPending}
          loadingText="Saving…"
          disabled={!isDirty}
        >
          Save changes
        </SubmitButton>
      </div>
    </form>
  )
}
