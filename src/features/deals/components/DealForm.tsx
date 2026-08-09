import { useEffect, useMemo } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SelectField } from '@/components/ui/select-field'
import { FormErrorMessage, SubmitButton } from '@/features/auth/components'
import type { AuthUser } from '@/features/auth/types/auth.types'
import type { Customer } from '@/features/customers/types/customer.types'
import type { Pipeline } from '@/features/pipelines/types/pipeline.types'
import type { PipelineStage } from '@/features/pipelines/types/pipelineStage.types'
import {
  dealCreateSchema,
  dealUpdateSchema,
  type DealCreateFormValues,
  type DealUpdateFormValues,
} from '@/features/deals/schemas/deal.schema'
import type { Deal } from '@/features/deals/types/deal.types'
import {
  dealCreateFormDefaults,
  dealToFormValues,
  dealUpdateFormDefaults,
} from '@/features/deals/utils/dealUtils'

export type DealFormValues = DealCreateFormValues | DealUpdateFormValues

type DealFormFieldValues = DealCreateFormValues & DealUpdateFormValues

export function DealForm({
  deal,
  customers,
  pipelines,
  stages,
  owners,
  isPending,
  serverError,
  submitLabel,
  loadingLabel,
  onCancel,
  onSubmit,
}: {
  deal: Deal | null
  customers: Customer[]
  pipelines: Pipeline[]
  stages: PipelineStage[]
  owners: AuthUser[]
  isPending: boolean
  serverError?: string
  submitLabel: string
  loadingLabel: string
  onCancel: () => void
  onSubmit: (values: DealFormValues) => void
}) {
  const isEdit = Boolean(deal)
  const schema = isEdit ? dealUpdateSchema : dealCreateSchema
  const defaultValues = isEdit
    ? dealUpdateFormDefaults
    : dealCreateFormDefaults

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<DealFormFieldValues>({
    resolver: zodResolver(schema) as Resolver<DealFormFieldValues>,
    mode: 'onTouched',
    defaultValues,
  })

  const pipelineId = watch('pipeline')
  const stageId = watch('stage')
  const availableStages = useMemo(
    () =>
      pipelineId ? stages.filter((stage) => stage.pipeline === pipelineId) : [],
    [pipelineId, stages],
  )
  const customerName = deal
    ? customers.find((customer) => customer._id === deal.customer)?.companyName
    : undefined

  useEffect(() => {
    if (deal) {
      reset(dealToFormValues(deal))
    } else {
      reset(defaultValues)
    }
  }, [deal, defaultValues, reset])

  useEffect(() => {
    if (stageId && !availableStages.some((stage) => stage._id === stageId)) {
      setValue('stage', '', { shouldDirty: true })
    }
  }, [stageId, availableStages, setValue])

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="title">Deal title</Label>
          <Input
            id="title"
            autoComplete="off"
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={errors.title ? 'title-error' : undefined}
            {...register('title')}
          />
          <FormErrorMessage message={errors.title?.message} id="title-error" />
        </div>

        {isEdit ? (
          <div className="flex flex-col gap-2">
            <Label>Customer</Label>
            <p className="text-sm text-muted-foreground">
              {customerName ?? '—'}
            </p>
          </div>
        ) : (
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
        )}

        <SelectField
          id="pipeline"
          label="Pipeline"
          error={errors.pipeline?.message}
          {...register('pipeline')}
        >
          <option value="">Select a pipeline</option>
          {pipelines.map((pipeline) => (
            <option key={pipeline._id} value={pipeline._id}>
              {pipeline.name}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="stage"
          label="Stage"
          error={errors.stage?.message}
          {...register('stage')}
        >
          <option value="">Select a stage</option>
          {availableStages.map((stage) => (
            <option key={stage._id} value={stage._id}>
              {stage.name}
            </option>
          ))}
        </SelectField>

        {isEdit ? (
          <SelectField
            id="owner"
            label="Owner"
            error={errors.owner?.message}
            hint="Leave unchanged to keep the current owner."
            {...register('owner')}
          >
            <option value="">No owner change</option>
            {owners.map((owner) => (
              <option key={owner._id} value={owner._id}>
                {owner.firstName} {owner.lastName}
              </option>
            ))}
          </SelectField>
        ) : null}

        <div className="flex flex-col gap-2">
          <Label htmlFor="value">
            Value <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="value"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            placeholder="25000"
            aria-invalid={errors.value ? true : undefined}
            aria-describedby={errors.value ? 'value-error' : undefined}
            {...register('value')}
          />
          <FormErrorMessage message={errors.value?.message} id="value-error" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="expectedCloseDate">
            Expected close date{' '}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="expectedCloseDate"
            type="date"
            aria-invalid={errors.expectedCloseDate ? true : undefined}
            aria-describedby={
              errors.expectedCloseDate ? 'expectedCloseDate-error' : undefined
            }
            {...register('expectedCloseDate')}
          />
          <FormErrorMessage
            message={errors.expectedCloseDate?.message}
            id="expectedCloseDate-error"
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="description">
            Description <span className="text-muted-foreground">(optional)</span>
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
