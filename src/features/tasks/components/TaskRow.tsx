import {
  CircleCheck,
  CircleX,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { TaskPriorityBadge } from '@/features/tasks/components/TaskPriorityBadge'
import { TaskStatusBadge } from '@/features/tasks/components/TaskStatusBadge'
import type { Task } from '@/features/tasks/types/task.types'
import { formatTaskDate } from '@/features/tasks/utils/taskUtils'

export const TASK_COLUMNS =
  'md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_auto_auto_auto_minmax(0,1fr)_auto]'

function TaskActions({
  task,
  onEdit,
  onDelete,
  onComplete,
  onCancel,
}: {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onComplete?: (task: Task) => void
  onCancel?: (task: Task) => void
}) {
  const showComplete = Boolean(onComplete) && task.status !== 'completed'
  const showCancel = Boolean(onCancel) && task.status !== 'cancelled'
  const showDivider = showComplete || showCancel

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Actions for ${task.title}`}
        >
          <MoreHorizontal aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {showComplete ? (
          <DropdownMenuItem onSelect={() => onComplete(task)}>
            <CircleCheck aria-hidden="true" />
            Mark complete
          </DropdownMenuItem>
        ) : null}
        {showCancel ? (
          <DropdownMenuItem onSelect={() => onCancel(task)}>
            <CircleX aria-hidden="true" />
            Cancel task
          </DropdownMenuItem>
        ) : null}
        {showDivider ? <DropdownMenuSeparator /> : null}
        <DropdownMenuItem onSelect={() => onEdit(task)}>
          <Pencil aria-hidden="true" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(task)}>
          <Trash2 aria-hidden="true" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function TaskRow({
  task,
  customerName,
  dealName,
  assigneeName,
  onEdit,
  onDelete,
  onComplete,
  onCancel,
}: {
  task: Task
  customerName?: string
  dealName?: string
  assigneeName?: string
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onComplete?: (task: Task) => void
  onCancel?: (task: Task) => void
}) {
  const relationship = [customerName, dealName].filter(Boolean).join(' · ')
  const actions = (
    <TaskActions
      task={task}
      onEdit={onEdit}
      onDelete={onDelete}
      onComplete={onComplete}
      onCancel={onCancel}
    />
  )

  return (
    <li className="border-b transition-colors last:border-0 hover:bg-muted/50">
      <div
        className={`hidden items-center gap-4 px-4 py-3 sm:px-6 md:grid ${TASK_COLUMNS}`}
      >
        <div className="min-w-0 truncate font-medium">{task.title}</div>
        <div className="hidden min-w-0 truncate text-muted-foreground lg:block">
          {relationship || '—'}
        </div>
        <div>
          <TaskStatusBadge status={task.status} isOverdue={task.isOverdue} />
        </div>
        <div>
          <TaskPriorityBadge priority={task.priority} />
        </div>
        <div className="hidden tabular-nums text-muted-foreground md:block">
          {formatTaskDate(task.dueDate)}
        </div>
        <div className="hidden min-w-0 truncate text-muted-foreground lg:block">
          {assigneeName ?? '—'}
        </div>
        <div className="flex justify-end">{actions}</div>
      </div>

      <div className="flex flex-col gap-2 px-4 py-3 sm:px-6 md:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="truncate font-medium">{task.title}</p>
            {relationship ? (
              <p className="truncate text-sm text-muted-foreground">
                {relationship}
              </p>
            ) : null}
          </div>
          {actions}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TaskStatusBadge status={task.status} isOverdue={task.isOverdue} />
          <TaskPriorityBadge priority={task.priority} />
        </div>
        <div className="flex flex-col gap-0.5 text-sm text-muted-foreground">
          <p className="tabular-nums">Due {formatTaskDate(task.dueDate)}</p>
          {assigneeName ? <p className="truncate">{assigneeName}</p> : null}
        </div>
      </div>
    </li>
  )
}
