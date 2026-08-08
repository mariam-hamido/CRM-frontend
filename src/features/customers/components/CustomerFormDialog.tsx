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
import { SelectField } from '@/components/ui/select-field'
import { FormErrorMessage, SubmitButton } from '@/features/auth/components'
import {
  CUSTOMER_SOURCE_LABELS,
  CUSTOMER_STATUS_LABELS,
} from '@/features/customers/constants/customerLabels'
import { useCreateCustomer } from '@/features/customers/hooks/useCreateCustomer'
import { useUpdateCustomer } from '@/features/customers/hooks/useUpdateCustomer'
import { customerFormSchema, type CustomerFormValues } from '@/features/customers/schemas/customer.schema'
import {
  CUSTOMER_SOURCES,
  CUSTOMER_STATUSES,
  type Customer,
} from '@/features/customers/types/customer.types'
import { customerToFormValues } from '@/features/customers/utils/customerUtils'

const DEFAULT_FORM_VALUES: CustomerFormValues = {
  companyName: '',
  industry: '',
  website: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  address: '',
  status: 'prospect',
  source: 'other',
  annualRevenue: '',
  employeesCount: '',
}

export function CustomerFormDialog({
  open,
  onOpenChange,
  customer,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer | null
}) {
  const create = useCreateCustomer()
  const update = useUpdateCustomer()
  const mutation = customer ? update : create
  const isEdit = Boolean(customer)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    mode: 'onTouched',
    defaultValues: DEFAULT_FORM_VALUES,
  })

  useEffect(() => {
    if (!open) return
    reset(customer ? customerToFormValues(customer) : DEFAULT_FORM_VALUES)
  }, [open, customer, reset])

  useEffect(() => {
    const fieldErrors = mutation.error?.fieldErrors
    if (!fieldErrors?.length) return

    for (const { field, message } of fieldErrors) {
      setError(field as FieldPath<CustomerFormValues>, {
        type: 'server',
        message,
      })
    }
  }, [mutation.error, setError])

  const onSubmit = handleSubmit((values) => {
    const handleSuccess = () => onOpenChange(false)

    if (customer) {
      update.mutate({ id: customer._id, values }, { onSuccess: handleSuccess })
    } else {
      create.mutate(values, { onSuccess: handleSuccess })
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit customer' : 'Add customer'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the details for this customer.'
              : 'Add a new customer to your workspace.'}
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="companyName">Company name</Label>
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

            <SelectField
              id="status"
              label="Status"
              error={errors.status?.message}
              {...register('status')}
            >
              {CUSTOMER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {CUSTOMER_STATUS_LABELS[status]}
                </option>
              ))}
            </SelectField>

            <SelectField
              id="source"
              label="Source"
              error={errors.source?.message}
              {...register('source')}
            >
              {CUSTOMER_SOURCES.map((source) => (
                <option key={source} value={source}>
                  {CUSTOMER_SOURCE_LABELS[source]}
                </option>
              ))}
            </SelectField>

            <div className="flex flex-col gap-2">
              <Label htmlFor="annualRevenue">
                Annual revenue{' '}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="annualRevenue"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                placeholder="2500000"
                aria-invalid={errors.annualRevenue ? true : undefined}
                aria-describedby={
                  errors.annualRevenue ? 'annualRevenue-error' : undefined
                }
                {...register('annualRevenue')}
              />
              <FormErrorMessage
                message={errors.annualRevenue?.message}
                id="annualRevenue-error"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="employeesCount">
                Employees count{' '}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="employeesCount"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                placeholder="120"
                aria-invalid={errors.employeesCount ? true : undefined}
                aria-describedby={
                  errors.employeesCount ? 'employeesCount-error' : undefined
                }
                {...register('employeesCount')}
              />
              <FormErrorMessage
                message={errors.employeesCount?.message}
                id="employeesCount-error"
              />
            </div>
          </div>

          {mutation.error?.message ? (
            <FormErrorMessage message={mutation.error.message} />
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <SubmitButton
              isLoading={mutation.isPending}
              loadingText={isEdit ? 'Saving…' : 'Creating…'}
              disabled={!isDirty}
            >
              {isEdit ? 'Save changes' : 'Create customer'}
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
