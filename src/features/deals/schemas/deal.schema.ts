import { z } from 'zod'

const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i

const titleSchema = z
  .string()
  .trim()
  .min(1, 'Deal title is required')
  .max(200, 'Deal title must be at most 200 characters')

const optionalTrimmedString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined))

const optionalObjectId = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || OBJECT_ID_PATTERN.test(value),
    'Must be a valid MongoDB ObjectId'
  )
  .transform((value) => (value ? value : undefined))

const optionalValue = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || (Number.isFinite(Number(value)) && Number(value) >= 0),
    'Deal value must be zero or a positive number'
  )

const optionalDate = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value),
    'Must be a valid date in YYYY-MM-DD format'
  )
  .transform((value) => (value ? value : undefined))

const requiredCustomerId = z
  .string()
  .min(1, 'Customer is required')
  .regex(OBJECT_ID_PATTERN, 'Customer must be a valid ID')

const requiredPipelineId = z
  .string()
  .min(1, 'Pipeline is required')
  .regex(OBJECT_ID_PATTERN, 'Pipeline must be a valid ID')

const requiredStageId = z
  .string()
  .min(1, 'Stage is required')
  .regex(OBJECT_ID_PATTERN, 'Stage must be a valid ID')

export const dealCreateSchema = z.object({
  title: titleSchema,
  customer: requiredCustomerId,
  pipeline: requiredPipelineId,
  stage: requiredStageId,
  value: optionalValue,
  expectedCloseDate: optionalDate,
  description: optionalTrimmedString,
})

export const dealUpdateSchema = z.object({
  title: titleSchema,
  owner: optionalObjectId,
  pipeline: optionalObjectId,
  stage: optionalObjectId,
  value: optionalValue,
  expectedCloseDate: optionalDate,
  description: optionalTrimmedString,
})

export type DealCreateFormValues = z.input<typeof dealCreateSchema>
export type DealUpdateFormValues = z.input<typeof dealUpdateSchema>
