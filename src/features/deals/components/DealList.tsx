import { Card } from '@/components/ui/card'
import { DEAL_COLUMNS, DealRow } from '@/features/deals/components/DealRow'
import type { Deal } from '@/features/deals/types/deal.types'

export function DealList({
  deals,
  customerNames,
  pipelineNames,
  stageNames,
  ownerNames,
  onEdit,
  onDelete,
}: {
  deals: Deal[]
  customerNames: Map<string, string>
  pipelineNames: Map<string, string>
  stageNames: Map<string, string>
  ownerNames: Map<string, string>
  onEdit: (deal: Deal) => void
  onDelete: (deal: Deal) => void
}) {
  return (
    <Card>
      <div
        className={`hidden items-center gap-4 border-b px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-6 md:grid ${DEAL_COLUMNS}`}
      >
        <span>Title</span>
        <span className="hidden lg:block">Customer</span>
        <span className="hidden md:block">Stage</span>
        <span>Value</span>
        <span className="hidden md:block">Probability</span>
        <span className="hidden xl:block">Close date</span>
        <span className="hidden lg:block">Owner</span>
        <span className="text-right">
          <span className="sr-only">Actions</span>
        </span>
      </div>
      <ul>
        {deals.map((deal) => (
          <DealRow
            key={deal._id}
            deal={deal}
            customerName={customerNames.get(deal.customer)}
            pipelineName={pipelineNames.get(deal.pipeline)}
            stageName={stageNames.get(deal.stage)}
            ownerName={ownerNames.get(deal.owner)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </Card>
  )
}
