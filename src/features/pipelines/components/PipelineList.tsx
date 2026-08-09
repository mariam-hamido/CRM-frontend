import { Card } from '@/components/ui/card'
import {
  PIPELINE_COLUMNS,
  PipelineRow,
} from '@/features/pipelines/components/PipelineRow'
import type { Pipeline } from '@/features/pipelines/types/pipeline.types'

export function PipelineList({
  pipelines,
  selectedPipelineId,
  onSelect,
  onEdit,
  onDelete,
}: {
  pipelines: Pipeline[]
  selectedPipelineId: string | null
  onSelect: (pipeline: Pipeline) => void
  onEdit: (pipeline: Pipeline) => void
  onDelete: (pipeline: Pipeline) => void
}) {
  return (
    <Card>
      <div
        className={`hidden gap-4 border-b px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-6 md:grid ${PIPELINE_COLUMNS}`}
      >
        <span>Pipeline</span>
        <span>Default</span>
        <span className="text-right">
          <span className="sr-only">Actions</span>
        </span>
      </div>
      <ul>
        {pipelines.map((pipeline) => (
          <PipelineRow
            key={pipeline._id}
            pipeline={pipeline}
            selected={pipeline._id === selectedPipelineId}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </Card>
  )
}
