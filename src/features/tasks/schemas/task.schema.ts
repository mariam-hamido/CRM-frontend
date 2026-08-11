import { z } from 'zod'
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
} from '@/features/tasks/types/task.types'

const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i

const DATETIME_LOCAL_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/

const titleSchema = z
  .string()
  .trim()
  .min(2, 'Task title must be between 2 and 200 characters')
  .max(200, 'Task title must be between 2 and 200 characters')

const optionalDescription = z
  .string()
  .trim()
  .max(2000, 'Description must be at most 2000 characters')
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

export const taskCreateSchema = z.object({
  title: titleSchema,
  description: optionalDescription,
  priority: z.enum(TASK_PRIORITIES),
  dueDate: requiredDatetime,
  reminderDate: optionalDatetime,
  assignedTo: optionalObjectId,
  customer: optionalObjectId,
  deal: optionalObjectId,
})

export const taskUpdateSchema = z.object({
  title: titleSchema,
  description: optionalDescription,
  priority: z.enum(TASK_PRIORITIES).optional(),
  status: z.enum(TASK_STATUSES).optional(),
  dueDate: optionalDatetime,
  reminderDate: optionalDatetime,
  assignedTo: optionalObjectId,
  customer: optionalObjectId,
  deal: optionalObjectId,
})

export type TaskCreateFormValues = z.input<typeof taskCreateSchema>
export type TaskUpdateFormValues = z.input<typeof taskUpdateSchema>
