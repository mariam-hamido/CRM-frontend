import { useState } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { GENERIC_API_ERROR_MESSAGE } from '@/api/interceptors'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SelectField } from '@/components/ui/select-field'
import {
  DealError,
  DealKanbanColumn,
  DealKanbanSkeleton,
} from '@/features/deals/components'
import { useDeals } from '@/features/deals/hooks/useDeals'
import { useMoveDealStage } from '@/features/deals/hooks/useMoveDealStage'
import type { Deal } from '@/features/deals/types/deal.types'
import { usePipelineStagesByPipeline } from '@/features/pipelines/hooks/usePipelineStages'
import type { Pipeline } from '@/features/pipelines/types/pipeline.types'
import type { AuthUser } from '@/features/auth/types/auth.types'
import type { Customer } from '@/features/customers/types/customer.types'

const BOARD_DEAL_LIMIT = 100

export function DealKanbanBoard({
  pipelines,
  customers,
  owners,
  onEdit,
  onDelete,
  onAddDeal,
}: {
  pipelines: Pipeline[]
  customers: Customer[]
  owners: AuthUser[]
  onEdit: (deal: Deal) => void
  onDelete: (deal: Deal) => void
  onAddDeal: () => void
}) {
  const [pipelineId, setPipelineId] = useState('')
  const moveStage = useMoveDealStage()

  const stagesQuery = usePipelineStagesByPipeline(pipelineId || undefined)
  const dealsQuery = useDeals(
    { pipeline: pipelineId || undefined, limit: BOARD_DEAL_LIMIT },
    Boolean(pipelineId)
  )

  const stages = stagesQuery.data?.stages ?? []
  const deals = dealsQuery.data?.deals ?? []

  const dealsByStage = new Map<string, Deal[]>()
  for (const stage of stages) {
    dealsByStage.set(stage._id, [])
  }
  for (const deal of deals) {
    const group = dealsByStage.get(deal.stage)
    if (group) group.push(deal)
  }

  const stageIds = new Set(stages.map((stage) => stage._id))

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const deal = deals.find((entry) => entry._id === active.id)
    if (!deal) return

    let targetStageId = String(over.id)
    if (!stageIds.has(targetStageId)) {
      const overDeal = deals.find((entry) => entry._id === over.id)
      targetStageId = overDeal ? overDeal.stage : ''
    }

    if (!targetStageId || targetStageId === deal.stage) return

    moveStage.mutate({ id: deal._id, payload: { stage: targetStageId } })
  }

  if (pipelines.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <p className="font-medium">No pipelines yet</p>
          <p className="text-sm text-muted-foreground">
            Create a pipeline to view deals on the board.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <SelectField
          id="board-pipeline"
          aria-label="Pipeline"
          className="w-full sm:w-72"
          value={pipelineId}
          onChange={(event) => setPipelineId(event.target.value)}
        >
          <option value="">Select a pipeline</option>
          {pipelines.map((pipeline) => (
            <option key={pipeline._id} value={pipeline._id}>
              {pipeline.name}
            </option>
          ))}
        </SelectField>
      </div>

      {pipelineId === '' ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <p className="font-medium">Select a pipeline</p>
            <p className="text-sm text-muted-foreground">
              Choose a pipeline above to view its deals on the board.
            </p>
          </CardContent>
        </Card>
      ) : stagesQuery.isPending || dealsQuery.isPending ? (
        <DealKanbanSkeleton />
      ) : stagesQuery.isError ? (
        <DealError
          message={stagesQuery.error?.message ?? GENERIC_API_ERROR_MESSAGE}
          onRetry={() => void stagesQuery.refetch()}
        />
      ) : dealsQuery.isError ? (
        <DealError
          message={dealsQuery.error?.message ?? GENERIC_API_ERROR_MESSAGE}
          onRetry={() => void dealsQuery.refetch()}
        />
      ) : stages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <p className="font-medium">This pipeline has no stages</p>
            <p className="text-sm text-muted-foreground">
              Add stages to this pipeline before using the board.
            </p>
          </CardContent>
        </Card>
      ) : deals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="font-medium">No deals in this pipeline.</p>
            <p className="text-sm text-muted-foreground">
              Drag deals here or create a new one.
            </p>
            <Button type="button" variant="outline" onClick={onAddDeal}>
              <Plus aria-hidden="true" />
              Add deal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          modifiers={[restrictToFirstScrollableAncestor]}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div
            className="flex items-start gap-4 overflow-x-auto pb-2"
            aria-label="Deals board"
          >
            {stages.map((stage) => (
              <DealKanbanColumn
                key={stage._id}
                stage={stage}
                deals={dealsByStage.get(stage._id) ?? []}
                customers={customers}
                owners={owners}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </DndContext>
      )}
    </div>
  )
}
