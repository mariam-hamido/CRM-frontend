import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SubmitButton } from '@/features/auth/components'
import { useDeleteTask } from '@/features/tasks/hooks/useDeleteTask'
import type { Task } from '@/features/tasks/types/task.types'

export function TaskDeleteDialog({
  task,
  open,
  onOpenChange,
  onDeleted,
}: {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
}) {
  const deleteTask = useDeleteTask()

  const handleDelete = () => {
    if (!task) return
    deleteTask.mutate(task._id, {
      onSuccess: () => {
        onDeleted?.()
        onOpenChange(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete task</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">
              {task?.title ?? 'this task'}
            </span>
            ? This will remove this task from your active tasks list.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <SubmitButton
            variant="destructive"
            isLoading={deleteTask.isPending}
            loadingText="Deleting…"
            disabled={!task}
            onClick={handleDelete}
          >
            Delete task
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
