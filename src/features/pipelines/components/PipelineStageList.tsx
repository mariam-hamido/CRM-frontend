import { Card } from '@/components/ui/card'
import {
  PIPELINE_STAGE_COLUMNS,
  PipelineStageRow,
} from '@/features/pipelines/components/PipelineStageRow'
import type { PipelineStage } from '@/features/pipelines/types/pipelineStage.types'

export function PipelineStageList({
  stages,
  onEdit,
  onDelete,
}: {
  stages: PipelineStage[]
  onEdit: (stage: PipelineStage) => void
  onDelete: (stage: PipelineStage) => void
}) {
  return (
    <Card>
      <div
        className={`hidden gap-4 border-b px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-6 md:grid ${PIPELINE_STAGE_COLUMNS}`}
      >
        <span>Order</span>
        <span>Stage</span>
        <span>Probability</span>
        <span>Outcome</span>
        <span className="text-right">
          <span className="sr-only">Actions</span>
        </span>
      </div>
      <ul>
        {stages.map((stage) => (
          <PipelineStageRow
            key={stage._id}
            stage={stage}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </Card>
  )
}
