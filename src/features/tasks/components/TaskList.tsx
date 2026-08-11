import { Card } from '@/components/ui/card'
import { TASK_COLUMNS, TaskRow } from '@/features/tasks/components/TaskRow'
import type { Task } from '@/features/tasks/types/task.types'

export function TaskList({
  tasks,
  customerNames,
  dealNames,
  assigneeNames,
  onEdit,
  onDelete,
  onComplete,
  onCancel,
}: {
  tasks: Task[]
  customerNames: Map<string, string>
  dealNames: Map<string, string>
  assigneeNames: Map<string, string>
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onComplete?: (task: Task) => void
  onCancel?: (task: Task) => void
}) {
  return (
    <Card>
      <div
        className={`hidden items-center gap-4 border-b px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-6 md:grid ${TASK_COLUMNS}`}
      >
        <span>Title</span>
        <span className="hidden lg:block">Customer / Deal</span>
        <span>Status</span>
        <span>Priority</span>
        <span className="hidden md:block">Due</span>
        <span className="hidden lg:block">Assignee</span>
        <span className="text-right">
          <span className="sr-only">Actions</span>
        </span>
      </div>
      <ul>
        {tasks.map((task) => (
          <TaskRow
            key={task._id}
            task={task}
            customerName={customerNames.get(task.customer ?? '')}
            dealName={dealNames.get(task.deal ?? '')}
            assigneeName={assigneeNames.get(task.assignedTo)}
            onEdit={onEdit}
            onDelete={onDelete}
            onComplete={onComplete}
            onCancel={onCancel}
          />
        ))}
      </ul>
    </Card>
  )
}
