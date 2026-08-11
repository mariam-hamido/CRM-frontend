import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { GENERIC_API_ERROR_MESSAGE } from '@/api/interceptors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { SelectField } from '@/components/ui/select-field'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { selectUser, useAuthStore } from '@/features/auth/store/authStore'
import { useGetCustomers } from '@/features/customers/hooks/useGetCustomers'
import { useDeals } from '@/features/deals/hooks/useDeals'
import {
  TaskDeleteDialog,
  TaskDialog,
  TaskEmpty,
  TaskError,
  TaskList,
  TaskLoading,
} from '@/features/tasks/components'
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
} from '@/features/tasks/constants/taskLabels'
import { useCancelTask } from '@/features/tasks/hooks/useCancelTask'
import { useCompleteTask } from '@/features/tasks/hooks/useCompleteTask'
import { useTasks } from '@/features/tasks/hooks/useTasks'
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from '@/features/tasks/types/task.types'

const PAGE_SIZE = 10
const LOOKUP_LIMIT = 100

export default function TasksPage() {
  const currentUser = useAuthStore(selectUser)

  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('')
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const search = useDebouncedValue(searchInput, 300)

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter, priorityFilter])

  const tasksQuery = useTasks({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
  })

  const customersQuery = useGetCustomers({ limit: LOOKUP_LIMIT })
  const dealsQuery = useDeals({ limit: LOOKUP_LIMIT })

  const customers = customersQuery.data?.customers ?? []
  const deals = dealsQuery.data?.deals ?? []

  const customerNames = new Map(
    customers.map((customer) => [customer._id, customer.companyName])
  )
  const dealNames = new Map(deals.map((deal) => [deal._id, deal.title]))
  const assigneeNames = currentUser
    ? new Map([
        [currentUser._id, `${currentUser.firstName} ${currentUser.lastName}`],
      ])
    : new Map<string, string>()

  const completeTask = useCompleteTask()
  const cancelTask = useCancelTask()

  const isAdminOrManager =
    currentUser?.role === 'admin' || currentUser?.role === 'manager'

  const canEditTask = (task: Task) =>
    isAdminOrManager || task.assignedTo === currentUser?._id
  const canDeleteTask = (task: Task) =>
    isAdminOrManager || task.createdBy === currentUser?._id
  const canCompleteTask = (task: Task) =>
    isAdminOrManager || task.assignedTo === currentUser?._id
  const canCancelTask = (task: Task) =>
    isAdminOrManager || task.assignedTo === currentUser?._id

  const tasks = tasksQuery.data?.tasks ?? []
  const pagination = tasksQuery.data?.pagination
  const hasActiveFilters = Boolean(search || statusFilter || priorityFilter)
  const hasTasks = pagination ? pagination.total > 0 : tasks.length > 0

  const openCreateDialog = () => {
    setSelectedTask(null)
    setIsTaskDialogOpen(true)
  }

  const openEditDialog = (task: Task) => {
    setSelectedTask(task)
    setIsTaskDialogOpen(true)
  }

  const openDeleteDialog = (task: Task) => {
    setSelectedTask(task)
    setIsDeleteDialogOpen(true)
  }

  const handleTaskDialogOpenChange = (open: boolean) => {
    setIsTaskDialogOpen(open)
    if (!open) setSelectedTask(null)
  }

  const clearFilters = () => {
    setSearchInput('')
    setStatusFilter('')
    setPriorityFilter('')
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Tasks
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage the tasks in your workspace.
          </p>
        </div>
        <Button type="button" onClick={openCreateDialog}>
          <Plus aria-hidden="true" />
          Add task
        </Button>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search by task title…"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="pl-9"
            aria-label="Search tasks"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SelectField
            id="status-filter"
            aria-label="Filter by status"
            className="w-40"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as TaskStatus | '')
            }
          >
            <option value="">All statuses</option>
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {TASK_STATUS_LABELS[status]}
              </option>
            ))}
          </SelectField>

          <SelectField
            id="priority-filter"
            aria-label="Filter by priority"
            className="w-40"
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(event.target.value as TaskPriority | '')
            }
          >
            <option value="">All priorities</option>
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {TASK_PRIORITY_LABELS[priority]}
              </option>
            ))}
          </SelectField>
        </div>
      </div>

      {tasksQuery.isPending ? (
        <TaskLoading />
      ) : tasksQuery.isError ? (
        <TaskError
          message={tasksQuery.error?.message ?? GENERIC_API_ERROR_MESSAGE}
          onRetry={() => void tasksQuery.refetch()}
        />
      ) : tasks.length === 0 ? (
        <TaskEmpty
          hasActiveFilters={hasActiveFilters}
          onAdd={openCreateDialog}
          onClearFilters={hasActiveFilters ? clearFilters : undefined}
        />
      ) : (
        <TaskList
          tasks={tasks}
          customerNames={customerNames}
          dealNames={dealNames}
          assigneeNames={assigneeNames}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          onComplete={(task) => completeTask.mutate(task._id)}
          onCancel={(task) => cancelTask.mutate(task._id)}
          canEdit={canEditTask}
          canDelete={canDeleteTask}
          canComplete={canCompleteTask}
          canCancel={canCancelTask}
        />
      )}

      {hasTasks && pagination ? (
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          itemLabel="tasks"
        />
      ) : null}

      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={handleTaskDialogOpenChange}
        task={selectedTask}
        currentUser={currentUser ?? undefined}
        customers={customers}
        deals={deals}
      />

      <TaskDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedTask(null)
        }}
        task={selectedTask}
      />
    </div>
  )
}
