import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormErrorMessage, SubmitButton } from '@/features/auth/components'
import {
  pipelineFormSchema,
  type PipelineFormValues,
} from '@/features/pipelines/schemas/pipeline.schema'
import type { Pipeline } from '@/features/pipelines/types/pipeline.types'
import { pipelineToFormValues } from '@/features/pipelines/utils/pipelineUtils'

const DEFAULT_FORM_VALUES: PipelineFormValues = {
  name: '',
  description: '',
  color: '',
  isDefault: false,
}

function isValidHexColor(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value)
}

export function PipelineForm({
  pipeline,
  isPending,
  serverError,
  submitLabel,
  loadingLabel,
  onCancel,
  onSubmit,
}: {
  pipeline: Pipeline | null
  isPending: boolean
  serverError?: string
  submitLabel: string
  loadingLabel: string
  onCancel: () => void
  onSubmit: (values: PipelineFormValues) => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<PipelineFormValues>({
    resolver: zodResolver(pipelineFormSchema),
    mode: 'onTouched',
    defaultValues: DEFAULT_FORM_VALUES,
  })

  const colorValue = watch('color')

  useEffect(() => {
    if (pipeline) {
      reset(pipelineToFormValues(pipeline))
    } else {
      reset(DEFAULT_FORM_VALUES)
    }
  }, [pipeline, reset])

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Pipeline name</Label>
        <Input
          id="name"
          autoComplete="off"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? 'name-error' : undefined}
          {...register('name')}
        />
        <FormErrorMessage message={errors.name?.message} id="name-error" />
      </div>

      <div className="flex flex-col gap-2">
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
        <Label htmlFor="color">
          Color <span className="text-muted-foreground">(optional)</span>
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="color-picker"
            type="color"
            aria-label="Pipeline color picker"
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

      <div className="flex items-center gap-2">
        <input
          id="isDefault"
          type="checkbox"
          aria-invalid={errors.isDefault ? true : undefined}
          className="size-4 rounded border-input accent-primary"
          {...register('isDefault')}
        />
        <Label htmlFor="isDefault">Set as default pipeline</Label>
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
