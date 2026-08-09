import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PipelineStageForm } from '@/features/pipelines/components/PipelineStageForm'
import { useCreatePipelineStage } from '@/features/pipelines/hooks/useCreatePipelineStage'
import { useUpdatePipelineStage } from '@/features/pipelines/hooks/useUpdatePipelineStage'
import type { PipelineStageFormValues } from '@/features/pipelines/schemas/pipelineStage.schema'
import type { PipelineStage } from '@/features/pipelines/types/pipelineStage.types'
import {
  toCreatePipelineStagePayload,
  toUpdatePipelineStagePayload,
} from '@/features/pipelines/utils/pipelineStageUtils'

export function PipelineStageDialog({
  pipelineId,
  stage,
  open,
  onOpenChange,
}: {
  pipelineId: string
  stage: PipelineStage | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const create = useCreatePipelineStage()
  const update = useUpdatePipelineStage()
  const mutation = stage ? update : create
  const isEdit = Boolean(stage)

  const handleSubmit = (values: PipelineStageFormValues) => {
    const handleSuccess = () => onOpenChange(false)

    if (stage) {
      update.mutate(
        { id: stage._id, payload: toUpdatePipelineStagePayload(values) },
        { onSuccess: handleSuccess }
      )
    } else {
      create.mutate(toCreatePipelineStagePayload(values, pipelineId), {
        onSuccess: handleSuccess,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit stage' : 'Add stage'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the details for this stage.'
              : 'Add a new stage to this pipeline.'}
          </DialogDescription>
        </DialogHeader>

        <PipelineStageForm
          stage={stage}
          isPending={mutation.isPending}
          serverError={mutation.error?.message}
          submitLabel={isEdit ? 'Save changes' : 'Add stage'}
          loadingLabel={isEdit ? 'Saving…' : 'Adding…'}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
