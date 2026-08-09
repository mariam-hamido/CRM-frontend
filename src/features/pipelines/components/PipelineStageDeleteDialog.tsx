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
import { useDeletePipelineStage } from '@/features/pipelines/hooks/useDeletePipelineStage'
import type { PipelineStage } from '@/features/pipelines/types/pipelineStage.types'

export function PipelineStageDeleteDialog({
  stage,
  open,
  onOpenChange,
}: {
  stage: PipelineStage | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const deleteStage = useDeletePipelineStage()

  const handleDelete = () => {
    if (!stage) return
    deleteStage.mutate(stage._id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete stage</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">
              {stage?.name ?? 'this stage'}
            </span>
            ? This action cannot be undone.
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
            isLoading={deleteStage.isPending}
            loadingText="Deleting…"
            disabled={!stage}
            onClick={handleDelete}
          >
            Delete stage
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
