import { z } from 'zod'

const optionalTrimmedString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined))

export const pipelineFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Pipeline name is required')
    .max(100, 'Pipeline name must be at most 100 characters'),
  description: z
    .string()
    .trim()
    .max(500, 'Description must be at most 500 characters')
    .optional()
    .transform((value) => (value ? value : undefined)),
  color: optionalTrimmedString,
  isDefault: z.boolean(),
})

export type PipelineFormValues = z.input<typeof pipelineFormSchema>
