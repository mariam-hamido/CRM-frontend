import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PipelineForm } from '@/features/pipelines/components/PipelineForm'
import { useCreatePipeline } from '@/features/pipelines/hooks/useCreatePipeline'
import { useUpdatePipeline } from '@/features/pipelines/hooks/useUpdatePipeline'
import type { PipelineFormValues } from '@/features/pipelines/schemas/pipeline.schema'
import type { Pipeline } from '@/features/pipelines/types/pipeline.types'
import {
  toCreatePipelinePayload,
  toUpdatePipelinePayload,
} from '@/features/pipelines/utils/pipelineUtils'

export function PipelineDialog({
  pipeline,
  open,
  onOpenChange,
  onCreated,
}: {
  pipeline: Pipeline | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: (pipeline: Pipeline) => void
}) {
  const create = useCreatePipeline()
  const update = useUpdatePipeline()
  const mutation = pipeline ? update : create
  const isEdit = Boolean(pipeline)

  const handleSubmit = (values: PipelineFormValues) => {
    if (pipeline) {
      update.mutate(
        { id: pipeline._id, payload: toUpdatePipelinePayload(values) },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      create.mutate(toCreatePipelinePayload(values), {
        onSuccess: (created) => {
          onOpenChange(false)
          onCreated?.(created)
        },
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit pipeline' : 'Add pipeline'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the details for this pipeline.'
              : 'Add a new pipeline to organize your sales stages.'}
          </DialogDescription>
        </DialogHeader>

        <PipelineForm
          pipeline={pipeline}
          isPending={mutation.isPending}
          serverError={mutation.error?.message}
          submitLabel={isEdit ? 'Save changes' : 'Add pipeline'}
          loadingLabel={isEdit ? 'Saving…' : 'Adding…'}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
