import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  TaskForm,
  type TaskFormValues,
} from '@/features/tasks/components/TaskForm'
import { useCreateTask } from '@/features/tasks/hooks/useCreateTask'
import { useUpdateTask } from '@/features/tasks/hooks/useUpdateTask'
import type {
  TaskCreateFormValues,
  TaskUpdateFormValues,
} from '@/features/tasks/schemas/task.schema'
import type { Task } from '@/features/tasks/types/task.types'
import {
  toCreateTaskPayload,
  toUpdateTaskPayload,
} from '@/features/tasks/utils/taskUtils'
import type { AuthUser } from '@/features/auth/types/auth.types'
import type { Customer } from '@/features/customers/types/customer.types'
import type { Deal } from '@/features/deals/types/deal.types'

export function TaskDialog({
  task,
  open,
  onOpenChange,
  currentUser,
  customers,
  deals,
}: {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUser?: AuthUser
  customers: Customer[]
  deals: Deal[]
}) {
  const create = useCreateTask()
  const update = useUpdateTask()
  const mutation = task ? update : create
  const isEdit = Boolean(task)

  const handleSubmit = (values: TaskFormValues) => {
    const handleSuccess = () => onOpenChange(false)

    if (task) {
      update.mutate(
        {
          id: task._id,
          payload: toUpdateTaskPayload(values as TaskUpdateFormValues),
        },
        { onSuccess: handleSuccess }
      )
    } else {
      create.mutate(toCreateTaskPayload(values as TaskCreateFormValues), {
        onSuccess: handleSuccess,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit task' : 'Add task'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the details for this task.'
              : 'Add a new task to track your work.'}
          </DialogDescription>
        </DialogHeader>

        <TaskForm
          task={task}
          currentUser={currentUser}
          customers={customers}
          deals={deals}
          isPending={mutation.isPending}
          serverError={mutation.error?.message}
          submitLabel={isEdit ? 'Save changes' : 'Add task'}
          loadingLabel={isEdit ? 'Saving…' : 'Adding…'}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
