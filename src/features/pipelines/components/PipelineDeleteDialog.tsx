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
import { useDeletePipeline } from '@/features/pipelines/hooks/useDeletePipeline'
import type { Pipeline } from '@/features/pipelines/types/pipeline.types'

export function PipelineDeleteDialog({
  pipeline,
  open,
  onOpenChange,
  onDeleted,
}: {
  pipeline: Pipeline | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted?: (id: string) => void
}) {
  const deletePipeline = useDeletePipeline()

  const handleDelete = () => {
    if (!pipeline) return
    deletePipeline.mutate(pipeline._id, {
      onSuccess: () => {
        onOpenChange(false)
        onDeleted?.(pipeline._id)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete pipeline</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">
              {pipeline?.name ?? 'this pipeline'}
            </span>
            ? This will also remove its stages. This action cannot be undone.
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
            isLoading={deletePipeline.isPending}
            loadingText="Deleting…"
            disabled={!pipeline}
            onClick={handleDelete}
          >
            Delete pipeline
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
