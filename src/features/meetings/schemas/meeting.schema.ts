import { z } from 'zod'
import {
  MEETING_STATUSES,
  MEETING_TYPES,
} from '@/features/meetings/types/meeting.types'

const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i

const DATETIME_LOCAL_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/

const titleSchema = z
  .string()
  .trim()
  .min(1, 'Meeting title is required')
  .max(200, 'Meeting title must be at most 200 characters')

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

const optionalDescription = z
  .string()
  .trim()
  .max(2000, 'Description must be at most 2000 characters')
  .optional()
  .transform((value) => (value ? value : undefined))

const optionalDuration = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) =>
      !value || (Number.isFinite(Number(value)) && Number(value) >= 1),
    'Duration must be a number greater than 0'
  )

const optionalDatetime = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || DATETIME_LOCAL_PATTERN.test(value),
    'Must be a valid date and time in YYYY-MM-DDTHH:mm format'
  )
  .transform((value) => (value ? value : undefined))

const requiredDatetime = z
  .string()
  .trim()
  .refine(
    (value) => DATETIME_LOCAL_PATTERN.test(value),
    'Must be a valid date and time in YYYY-MM-DDTHH:mm format'
  )

const requiredCustomerId = z
  .string()
  .min(1, 'Customer is required')
  .regex(OBJECT_ID_PATTERN, 'Customer must be a valid ID')

export const meetingCreateSchema = z.object({
  title: titleSchema,
  customer: requiredCustomerId,
  meetingDate: requiredDatetime,
  description: optionalDescription,
  deal: optionalObjectId,
  duration: optionalDuration,
  meetingType: z.enum(MEETING_TYPES),
  location: optionalTrimmedString,
  meetingLink: optionalTrimmedString,
  notes: optionalTrimmedString,
})

export const meetingUpdateSchema = z.object({
  title: titleSchema,
  description: optionalDescription,
  meetingDate: optionalDatetime,
  duration: optionalDuration,
  meetingType: z.enum(MEETING_TYPES).optional(),
  location: optionalTrimmedString,
  meetingLink: optionalTrimmedString,
  notes: optionalTrimmedString,
  customer: optionalObjectId,
  deal: optionalObjectId,
  status: z.enum(MEETING_STATUSES).optional(),
})

export type MeetingCreateFormValues = z.input<typeof meetingCreateSchema>
export type MeetingUpdateFormValues = z.input<typeof meetingUpdateSchema>
