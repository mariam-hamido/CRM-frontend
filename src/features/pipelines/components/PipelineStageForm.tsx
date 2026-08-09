import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormErrorMessage, SubmitButton } from '@/features/auth/components'
import {
  pipelineStageFormSchema,
  type PipelineStageFormValues,
} from '@/features/pipelines/schemas/pipelineStage.schema'
import type { PipelineStage } from '@/features/pipelines/types/pipelineStage.types'
import { pipelineStageToFormValues } from '@/features/pipelines/utils/pipelineStageUtils'

const DEFAULT_FORM_VALUES: PipelineStageFormValues = {
  name: '',
  description: '',
  order: '',
  color: '',
  probability: '',
  isWonStage: false,
  isLostStage: false,
}

function isValidHexColor(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value)
}

export function PipelineStageForm({
  stage,
  isPending,
  serverError,
  submitLabel,
  loadingLabel,
  onCancel,
  onSubmit,
}: {
  stage: PipelineStage | null
  isPending: boolean
  serverError?: string
  submitLabel: string
  loadingLabel: string
  onCancel: () => void
  onSubmit: (values: PipelineStageFormValues) => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<PipelineStageFormValues>({
    resolver: zodResolver(pipelineStageFormSchema),
    mode: 'onTouched',
    defaultValues: DEFAULT_FORM_VALUES,
  })

  const colorValue = watch('color')

  useEffect(() => {
    if (stage) {
      reset(pipelineStageToFormValues(stage))
    } else {
      reset(DEFAULT_FORM_VALUES)
    }
  }, [stage, reset])

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="name">Stage name</Label>
          <Input
            id="name"
            autoComplete="off"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'name-error' : undefined}
            {...register('name')}
          />
          <FormErrorMessage message={errors.name?.message} id="name-error" />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="description">
            Description <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="description"
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={errors.description ? 'description-error' : undefined}
            {...register('description')}
          />
          <FormErrorMessage
            message={errors.description?.message}
            id="description-error"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="order">
            Order <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="order"
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            placeholder="1"
            aria-invalid={errors.order ? true : undefined}
            aria-describedby={errors.order ? 'order-error' : undefined}
            {...register('order')}
          />
          <FormErrorMessage message={errors.order?.message} id="order-error" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="probability">
            Probability <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="probability"
            type="number"
            min="0"
            max="100"
            step="1"
            inputMode="numeric"
            placeholder="50"
            aria-invalid={errors.probability ? true : undefined}
            aria-describedby={errors.probability ? 'probability-error' : undefined}
            {...register('probability')}
          />
          <FormErrorMessage
            message={errors.probability?.message}
            id="probability-error"
          />
          <p className="text-xs text-muted-foreground">
            Percentage chance of winning. Between 0 and 100.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="color">
            Color <span className="text-muted-foreground">(optional)</span>
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="color-picker"
              type="color"
              aria-label="Stage color picker"
              className="size-9 shrink-0 cursor-pointer p-1"
              value={isValidHexColor(colorValue ?? '') ? colorValue : '#000000'}
              onChange={(event) =>
                setValue('color', event.target.value, { shouldDirty: true })
              }
            />
            <Input
              id="color"
              placeholder="#3b82f6"
              className="flex-1"
              aria-invalid={errors.color ? true : undefined}
              aria-describedby={errors.color ? 'color-error' : undefined}
              {...register('color')}
            />
          </div>
          <FormErrorMessage message={errors.color?.message} id="color-error" />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <input
                id="isWonStage"
                type="checkbox"
                aria-invalid={errors.isWonStage ? true : undefined}
                className="size-4 rounded border-input accent-primary"
                {...register('isWonStage')}
              />
              <Label htmlFor="isWonStage">Won stage</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="isLostStage"
                type="checkbox"
                aria-invalid={errors.isLostStage ? true : undefined}
                className="size-4 rounded border-input accent-primary"
                {...register('isLostStage')}
              />
              <Label htmlFor="isLostStage">Lost stage</Label>
            </div>
          </div>
          <FormErrorMessage message={errors.isWonStage?.message} />
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
