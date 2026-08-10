import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { cn } from '@/lib/utils'
import { DealKanbanCard } from '@/features/deals/components/DealKanbanCard'
import type { AuthUser } from '@/features/auth/types/auth.types'
import type { Deal } from '@/features/deals/types/deal.types'
import type { PipelineStage } from '@/features/pipelines/types/pipelineStage.types'

export function DealKanbanColumn({
  stage,
  deals,
  customerNames,
  owners,
  onEdit,
  onDelete,
}: {
  stage: PipelineStage
  deals: Deal[]
  customerNames: Map<string, string>
  owners: AuthUser[]
  onEdit: (deal: Deal) => void
  onDelete: (deal: Deal) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage._id })

  const ownerNames = new Map(
    owners.map((owner) => [owner._id, `${owner.firstName} ${owner.lastName}`])
  )

  return (
    <section
      ref={setNodeRef}
      aria-label={`${stage.name} stage`}
      className={cn(
        'flex w-72 shrink-0 flex-col rounded-xl border bg-muted/30',
        isOver ? 'border-primary bg-muted/60' : 'border-transparent'
      )}
    >
      <header className="flex items-center justify-between gap-2 px-3 py-2.5">
        <h2 className="min-w-0 truncate text-sm font-semibold">{stage.name}</h2>
        <span
          className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground"
          aria-label={`${deals.length} deals`}
        >
          {deals.length}
        </span>
      </header>

      {deals.length > 0 ? (
        <SortableContext
          items={deals.map((deal) => deal._id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex flex-col gap-2 p-2">
            {deals.map((deal) => (
              <DealKanbanCard
                key={deal._id}
                deal={deal}
                customerName={customerNames.get(deal.customer)}
                ownerName={ownerNames.get(deal.owner)}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </SortableContext>
      ) : (
        <p className="px-3 pb-4 text-sm text-muted-foreground">No deals</p>
      )}
    </section>
  )
}
