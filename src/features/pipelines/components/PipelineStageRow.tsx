import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { PipelineColorDot } from '@/features/pipelines/components/PipelineColorDot'
import { PipelineStageResultBadge } from '@/features/pipelines/components/PipelineStageResultBadge'
import type { PipelineStage } from '@/features/pipelines/types/pipelineStage.types'

export const PIPELINE_STAGE_COLUMNS =
  'md:grid-cols-[auto_minmax(0,1fr)_auto_auto_auto]'

function PipelineStageActions({
  stage,
  onEdit,
  onDelete,
}: {
  stage: PipelineStage
  onEdit: (stage: PipelineStage) => void
  onDelete: (stage: PipelineStage) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Actions for ${stage.name}`}
        >
          <MoreHorizontal aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => onEdit(stage)}>
          <Pencil aria-hidden="true" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => onDelete(stage)}
        >
          <Trash2 aria-hidden="true" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function PipelineStageRow({
  stage,
  onEdit,
  onDelete,
}: {
  stage: PipelineStage
  onEdit: (stage: PipelineStage) => void
  onDelete: (stage: PipelineStage) => void
}) {
  return (
    <li className="border-b transition-colors last:border-0 hover:bg-muted/50">
      <div
        className={`hidden items-center gap-4 px-4 py-3 sm:px-6 md:grid ${PIPELINE_STAGE_COLUMNS}`}
      >
        <div>
          <span className="inline-flex size-6 items-center justify-center rounded-md bg-muted text-xs font-medium tabular-nums">
            {stage.order}
          </span>
        </div>
        <div className="flex min-w-0 items-center gap-3">
          <PipelineColorDot color={stage.color} />
          <div className="min-w-0">
            <p className="truncate font-medium">{stage.name}</p>
            {stage.description ? (
              <p className="truncate text-sm text-muted-foreground">
                {stage.description}
              </p>
            ) : null}
          </div>
        </div>
        <div className="text-sm font-medium tabular-nums">
          {stage.probability}%
        </div>
        <div>
          <PipelineStageResultBadge
            isWonStage={stage.isWonStage}
            isLostStage={stage.isLostStage}
          />
        </div>
        <div className="flex justify-end">
          <PipelineStageActions
            stage={stage}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 py-3 sm:px-6 md:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium tabular-nums">
              {stage.order}
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium">{stage.name}</p>
              {stage.description ? (
                <p className="truncate text-sm text-muted-foreground">
                  {stage.description}
                </p>
              ) : null}
            </div>
          </div>
          <PipelineStageActions
            stage={stage}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PipelineStageResultBadge
            isWonStage={stage.isWonStage}
            isLostStage={stage.isLostStage}
          />
          <span className="text-sm font-medium tabular-nums text-muted-foreground">
            {stage.probability}% probability
          </span>
        </div>
      </div>
    </li>
  )
}
