import type {
  TaskCreateFormValues,
  TaskUpdateFormValues,
} from '@/features/tasks/schemas/task.schema'
import type {
  CreateTaskPayload,
  Task,
  UpdateTaskPayload,
} from '@/features/tasks/types/task.types'

export const DEFAULT_TASK_FORM_VALUES: TaskCreateFormValues = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  reminderDate: '',
  assignedTo: '',
  customer: '',
  deal: '',
}

export function formatTaskDate(value?: string) {
  if (!value) return '—'
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function isoToDatetimeLocal(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (num: number) => String(num).padStart(2, '0')
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`
  return `${day}T${time}`
}

export function taskToFormValues(task: Task): TaskUpdateFormValues {
  return {
    title: task.title,
    description: task.description ?? '',
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate ? isoToDatetimeLocal(task.dueDate) : '',
    reminderDate: task.reminderDate ? isoToDatetimeLocal(task.reminderDate) : '',
    assignedTo: task.assignedTo,
    customer: task.customer ?? '',
    deal: task.deal ?? '',
  }
}

export function toCreateTaskPayload(
  values: TaskCreateFormValues
): CreateTaskPayload {
  return {
    title: values.title,
    assignedTo: values.assignedTo ?? '',
    dueDate: values.dueDate,
    ...(values.description ? { description: values.description } : {}),
    ...(values.priority ? { priority: values.priority } : {}),
    ...(values.reminderDate ? { reminderDate: values.reminderDate } : {}),
    ...(values.customer ? { customer: values.customer } : {}),
    ...(values.deal ? { deal: values.deal } : {}),
  }
}

export function toUpdateTaskPayload(
  values: TaskUpdateFormValues
): UpdateTaskPayload {
  return {
    ...(values.title ? { title: values.title } : {}),
    ...(values.description ? { description: values.description } : {}),
    ...(values.priority ? { priority: values.priority } : {}),
    ...(values.status ? { status: values.status } : {}),
    ...(values.dueDate ? { dueDate: values.dueDate } : {}),
    ...(values.reminderDate ? { reminderDate: values.reminderDate } : {}),
    ...(values.assignedTo ? { assignedTo: values.assignedTo } : {}),
    ...(values.customer ? { customer: values.customer } : {}),
    ...(values.deal ? { deal: values.deal } : {}),
  }
}
