import { useEffect } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SelectField } from '@/components/ui/select-field'
import { FormErrorMessage, SubmitButton } from '@/features/auth/components'
import type { AuthUser } from '@/features/auth/types/auth.types'
import type { Customer } from '@/features/customers/types/customer.types'
import type { Deal } from '@/features/deals/types/deal.types'
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
} from '@/features/tasks/constants/taskLabels'
import {
  taskCreateSchema,
  taskUpdateSchema,
  type TaskCreateFormValues,
  type TaskUpdateFormValues,
} from '@/features/tasks/schemas/task.schema'
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type Task,
  type TaskStatus,
} from '@/features/tasks/types/task.types'
import {
  DEFAULT_TASK_FORM_VALUES,
  taskToFormValues,
} from '@/features/tasks/utils/taskUtils'

export type TaskFormValues = TaskCreateFormValues | TaskUpdateFormValues

type TaskFormFieldValues = TaskCreateFormValues & TaskUpdateFormValues

const MANUAL_TASK_STATUSES: TaskStatus[] = TASK_STATUSES.filter(
  (status) =>
    status !== 'completed' && status !== 'cancelled' && status !== 'overdue'
)

function createDefaultValues(currentUser?: AuthUser): TaskCreateFormValues {
  return {
    ...DEFAULT_TASK_FORM_VALUES,
    assignedTo: currentUser?._id ?? '',
  }
}

export function TaskForm({
  task,
  currentUser,
  customers,
  deals,
  isPending,
  serverError,
  submitLabel,
  loadingLabel,
  onCancel,
  onSubmit,
}: {
  task: Task | null
  currentUser?: AuthUser
  customers: Customer[]
  deals: Deal[]
  isPending: boolean
  serverError?: string
  submitLabel: string
  loadingLabel: string
  onCancel: () => void
  onSubmit: (values: TaskFormValues) => void
}) {
  const isEdit = Boolean(task)
  const schema = isEdit ? taskUpdateSchema : taskCreateSchema

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<TaskFormFieldValues>({
    resolver: zodResolver(schema) as Resolver<TaskFormFieldValues>,
    mode: 'onTouched',
    defaultValues: createDefaultValues(currentUser),
  })

  useEffect(() => {
    if (task) {
      reset(taskToFormValues(task))
    } else {
      reset(createDefaultValues(currentUser))
    }
  }, [task, currentUser, reset])

  let assigneeDisplay = '—'
  if (isEdit) {
    if (currentUser && task?.assignedTo === currentUser._id) {
      assigneeDisplay = `${currentUser.firstName} ${currentUser.lastName}`
    }
  } else if (currentUser) {
    assigneeDisplay = `${currentUser.firstName} ${currentUser.lastName}`
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            autoComplete="off"
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={errors.title ? 'title-error' : undefined}
            {...register('title')}
          />
          <FormErrorMessage message={errors.title?.message} id="title-error" />
        </div>

        <SelectField
          id="priority"
          label="Priority"
          error={errors.priority?.message}
          {...register('priority')}
        >
          {TASK_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {TASK_PRIORITY_LABELS[priority]}
            </option>
          ))}
        </SelectField>

        {isEdit ? (
          <SelectField
            id="status"
            label="Status"
            error={errors.status?.message}
            {...register('status')}
          >
            {TASK_STATUSES.map((status) => {
              const selectable = MANUAL_TASK_STATUSES.includes(status)
              const isCurrentStatus = status === task?.status
              return (
                <option
                  key={status}
                  value={status}
                  disabled={!selectable && !isCurrentStatus}
                >
                  {TASK_STATUS_LABELS[status]}
                </option>
              )
            })}
          </SelectField>
        ) : null}

        <div className="flex flex-col gap-2">
          <Label>Assignee</Label>
          <p className="text-sm text-muted-foreground">{assigneeDisplay}</p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="dueDate">Due date and time</Label>
          <Input
            id="dueDate"
            type="datetime-local"
            aria-invalid={errors.dueDate ? true : undefined}
            aria-describedby={errors.dueDate ? 'dueDate-error' : undefined}
            {...register('dueDate')}
          />
          <FormErrorMessage
            message={errors.dueDate?.message}
            id="dueDate-error"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="reminderDate">
            Reminder <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="reminderDate"
            type="datetime-local"
            aria-invalid={errors.reminderDate ? true : undefined}
            aria-describedby={
              errors.reminderDate ? 'reminderDate-error' : undefined
            }
            {...register('reminderDate')}
          />
          <FormErrorMessage
            message={errors.reminderDate?.message}
            id="reminderDate-error"
          />
        </div>

        <SelectField
          id="customer"
          label="Customer"
          error={errors.customer?.message}
          {...register('customer')}
        >
          <option value="">No customer</option>
          {customers.map((customer) => (
            <option key={customer._id} value={customer._id}>
              {customer.companyName}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="deal"
          label="Deal"
          error={errors.deal?.message}
          {...register('deal')}
        >
          <option value="">No deal</option>
          {deals.map((deal) => (
            <option key={deal._id} value={deal._id}>
              {deal.title}
            </option>
          ))}
        </SelectField>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="description">
            Description{' '}
            <span className="text-muted-foreground">(optional)</span>
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
