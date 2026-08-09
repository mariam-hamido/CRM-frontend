import { z } from 'zod'

const optionalTrimmedString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined))

const optionalOrder = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || (Number.isFinite(Number(value)) && Number(value) >= 1),
    'Order must be at least 1'
  )

const optionalProbability = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) =>
      !value ||
      (Number.isFinite(Number(value)) &&
        Number(value) >= 0 &&
        Number(value) <= 100),
    'Probability must be between 0 and 100'
  )

export const pipelineStageFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Stage name is required')
      .max(100, 'Stage name must be at most 100 characters'),
    description: z
      .string()
      .trim()
      .max(500, 'Description must be at most 500 characters')
      .optional()
      .transform((value) => (value ? value : undefined)),
    order: optionalOrder,
    color: optionalTrimmedString,
    probability: optionalProbability,
    isWonStage: z.boolean(),
    isLostStage: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.isWonStage && data.isLostStage) {
      ctx.addIssue({
        code: 'custom',
        path: ['isWonStage'],
        message: 'A stage cannot be both a won and lost stage',
      })
    }
  })

export type PipelineStageFormValues = z.input<typeof pipelineStageFormSchema>
