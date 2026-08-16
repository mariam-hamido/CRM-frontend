import { useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  CircleCheck,
  CircleX,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { GENERIC_API_ERROR_MESSAGE } from '@/api/interceptors'
import { ROUTES } from '@/app/router/routeConstants'
import { Button } from '@/components/ui/button'
import {
  CompanyInfoCard,
  type CompanyInfoRow,
} from '@/features/companies/components'
import { selectUser, useAuthStore } from '@/features/auth/store/authStore'
import {
  useGetCustomer,
  useGetCustomers,
} from '@/features/customers/hooks/useGetCustomers'
import { useDeal } from '@/features/deals/hooks/useDeal'
import { useDeals } from '@/features/deals/hooks/useDeals'
import {
  TaskDeleteDialog,
  TaskDialog,
  TaskError,
  TaskLoading,
  TaskPriorityBadge,
  TaskStatusBadge,
} from '@/features/tasks/components'
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
} from '@/features/tasks/constants/taskLabels'
import { useCancelTask } from '@/features/tasks/hooks/useCancelTask'
import { useCompleteTask } from '@/features/tasks/hooks/useCompleteTask'
import { useTask } from '@/features/tasks/hooks/useTask'
import type { Task } from '@/features/tasks/types/task.types'
import { formatTaskDate } from '@/features/tasks/utils/taskUtils'
import type { Customer } from '@/features/customers/types/customer.types'
import type { Deal } from '@/features/deals/types/deal.types'

const LOOKUP_LIMIT = 100

function buildOverviewRows(task: Task): CompanyInfoRow[] {
  const rows: CompanyInfoRow[] = [
    { label: 'Status', value: TASK_STATUS_LABELS[task.status] },
    { label: 'Priority', value: TASK_PRIORITY_LABELS[task.priority] },
    { label: 'Due date', value: formatTaskDate(task.dueDate) },
    { label: 'Reminder', value: formatTaskDate(task.reminderDate ?? undefined) },
    { label: 'Overdue', value: task.isOverdue ? 'Yes' : 'No' },
  ]
  if (task.description) {
    rows.push({ label: 'Description', value: task.description })
  }
  if (task.completedAt) {
    rows.push({
      label: 'Completed at',
      value: formatTaskDate(task.completedAt),
    })
  }
  return rows
}

function buildRelationshipRows(
  customer?: Customer,
  deal?: Deal,
  assigneeName?: string
): CompanyInfoRow[] {
  return [
    {
      label: 'Customer',
      value: customer ? (
        <Link
          to={ROUTES.customersDetail.replace(':id', customer._id)}
          className="text-primary underline underline-offset-4 hover:opacity-80"
        >
          {customer.companyName}
        </Link>
      ) : (
        '—'
      ),
    },
    {
      label: 'Deal',
      value: deal ? (
        <Link
          to={ROUTES.dealsDetail.replace(':id', deal._id)}
          className="text-primary underline underline-offset-4 hover:opacity-80"
        >
          {deal.title}
        </Link>
      ) : (
        '—'
      ),
    },
    { label: 'Assignee', value: assigneeName ?? '—' },
  ]
}

function buildMetadataRows(task: Task): CompanyInfoRow[] {
  return [
    { label: 'Created', value: formatTaskDate(task.createdAt) },
    { label: 'Last updated', value: formatTaskDate(task.updatedAt) },
  ]
}

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const currentUser = useAuthStore(selectUser)

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const taskQuery = useTask(id)
  const task = taskQuery.data

  const customersQuery = useGetCustomers({ limit: LOOKUP_LIMIT })
  const dealsQuery = useDeals({ limit: LOOKUP_LIMIT })
  const customerQuery = useGetCustomer(task?.customer ?? undefined)
  const dealQuery = useDeal(task?.deal ?? undefined)

  const completeTask = useCompleteTask()
  const cancelTask = useCancelTask()

  const customer = customerQuery.data
  const deal = dealQuery.data

  const isAdminOrManager =
    currentUser?.role === 'admin' || currentUser?.role === 'manager'
  const isAssigned = Boolean(task) && task?.assignedTo === currentUser?._id

  const canEdit = isAdminOrManager || isAssigned
  const canComplete = isAdminOrManager || isAssigned
  const canCancel = isAdminOrManager || isAssigned
  const canDelete = isAdminOrManager || task?.createdBy === currentUser?._id

  const showComplete =
    Boolean(task) && canComplete && task?.status !== 'completed'
  const showCancel = Boolean(task) && canCancel && task?.status !== 'cancelled'

  const assigneeName =
    task && currentUser && task.assignedTo === currentUser._id
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : undefined

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit"
        onClick={() => navigate(ROUTES.tasks)}
      >
        <ArrowLeft aria-hidden="true" />
        Back to tasks
      </Button>

      {!id ? (
        <TaskError
          message="Task ID is missing."
          onRetry={() => navigate(ROUTES.tasks)}
        />
      ) : taskQuery.isPending ? (
        <TaskLoading />
      ) : taskQuery.isError ? (
        <TaskError
          message={taskQuery.error?.message ?? GENERIC_API_ERROR_MESSAGE}
          onRetry={() => void taskQuery.refetch()}
        />
      ) : task ? (
        <>
          <header className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="min-w-0 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {task.title}
                </h1>
                <TaskStatusBadge
                  status={task.status}
                  isOverdue={task.isOverdue}
                />
                <TaskPriorityBadge priority={task.priority} />
                {task.isOverdue ? (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-destructive">
                    <AlertCircle className="size-4" aria-hidden="true" />
                    Overdue
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-muted-foreground">
                Task information
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {showComplete ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => completeTask.mutate(task._id)}
                  disabled={completeTask.isPending}
                >
                  <CircleCheck aria-hidden="true" />
                  Complete
                </Button>
              ) : null}
              {showCancel ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => cancelTask.mutate(task._id)}
                  disabled={cancelTask.isPending}
                >
                  <CircleX aria-hidden="true" />
                  Cancel task
                </Button>
              ) : null}
              {canEdit ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditOpen(true)}
                >
                  <Pencil aria-hidden="true" />
                  Edit
                </Button>
              ) : null}
              {canDelete ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 aria-hidden="true" />
                  Delete
                </Button>
              ) : null}
            </div>
          </header>

          <section
            aria-label="Task information"
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          >
            <CompanyInfoCard
              title="Task overview"
              rows={buildOverviewRows(task)}
              className="lg:col-span-2"
            />
            <CompanyInfoCard
              title="Relationships"
              rows={buildRelationshipRows(customer, deal, assigneeName)}
            />
            <CompanyInfoCard
              title="Task metadata"
              rows={buildMetadataRows(task)}
            />
          </section>

          <TaskDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            task={task}
            currentUser={currentUser ?? undefined}
            customers={customersQuery.data?.customers ?? []}
            deals={dealsQuery.data?.deals ?? []}
          />

          <TaskDeleteDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            task={task}
            onDeleted={() => navigate(ROUTES.tasks)}
          />
        </>
      ) : (
        <TaskLoading />
      )}
    </div>
  )
}
