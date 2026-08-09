import { Check, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PipelineColorDot } from '@/features/pipelines/components/PipelineColorDot'
import { PipelineDefaultBadge } from '@/features/pipelines/components/PipelineDefaultBadge'
import type { Pipeline } from '@/features/pipelines/types/pipeline.types'

export const PIPELINE_COLUMNS = 'md:grid-cols-[minmax(0,1fr)_auto_auto]'

function PipelineActions({
  pipeline,
  onEdit,
  onDelete,
}: {
  pipeline: Pipeline
  onEdit: (pipeline: Pipeline) => void
  onDelete: (pipeline: Pipeline) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Actions for ${pipeline.name}`}
        >
          <MoreHorizontal aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => onEdit(pipeline)}>
          <Pencil aria-hidden="true" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => onDelete(pipeline)}
        >
          <Trash2 aria-hidden="true" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function PipelineSelectButton({
  pipeline,
  selected,
  onSelect,
}: {
  pipeline: Pipeline
  selected: boolean
  onSelect: (pipeline: Pipeline) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(pipeline)}
      aria-pressed={selected}
      className="flex min-w-0 items-center gap-3 rounded-md text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <PipelineColorDot color={pipeline.color} />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{pipeline.name}</span>
        {pipeline.description ? (
          <span className="block truncate text-sm text-muted-foreground">
            {pipeline.description}
          </span>
        ) : null}
      </span>
      {selected ? (
        <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
      ) : null}
    </button>
  )
}

export function PipelineRow({
  pipeline,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: {
  pipeline: Pipeline
  selected: boolean
  onSelect: (pipeline: Pipeline) => void
  onEdit: (pipeline: Pipeline) => void
  onDelete: (pipeline: Pipeline) => void
}) {
  return (
    <li
      className={cn(
        'border-b transition-colors last:border-0 hover:bg-muted/50',
        selected && 'bg-muted/70 hover:bg-muted/70'
      )}
    >
      <div
        className={`hidden items-center gap-4 px-4 py-3 sm:px-6 md:grid ${PIPELINE_COLUMNS}`}
      >
        <PipelineSelectButton
          pipeline={pipeline}
          selected={selected}
          onSelect={onSelect}
        />
        <div className="flex items-center">
          <PipelineDefaultBadge isDefault={pipeline.isDefault} />
        </div>
        <div className="flex justify-end">
          <PipelineActions
            pipeline={pipeline}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 md:hidden">
        <PipelineSelectButton
          pipeline={pipeline}
          selected={selected}
          onSelect={onSelect}
        />
        <PipelineDefaultBadge isDefault={pipeline.isDefault} />
        <PipelineActions pipeline={pipeline} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </li>
  )
}
