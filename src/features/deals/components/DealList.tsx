import { Card } from '@/components/ui/card'
import { DEAL_COLUMNS, DealRow } from '@/features/deals/components/DealRow'
import type { AuthUser } from '@/features/auth/types/auth.types'
import type { Customer } from '@/features/customers/types/customer.types'
import type { Pipeline } from '@/features/pipelines/types/pipeline.types'
import type { PipelineStage } from '@/features/pipelines/types/pipelineStage.types'
import type { Deal } from '@/features/deals/types/deal.types'

export function DealList({
  deals,
  customers,
  pipelines,
  stages,
  owners,
  onEdit,
  onDelete,
}: {
  deals: Deal[]
  customers: Customer[]
  pipelines: Pipeline[]
  stages: PipelineStage[]
  owners: AuthUser[]
  onEdit: (deal: Deal) => void
  onDelete: (deal: Deal) => void
}) {
  const customerNames = new Map(
    customers.map((customer) => [customer._id, customer.companyName])
  )
  const pipelineNames = new Map(
    pipelines.map((pipeline) => [pipeline._id, pipeline.name])
  )
  const stageNames = new Map(
    stages.map((stage) => [stage._id, stage.name])
  )
  const ownerNames = new Map(
    owners.map((owner) => [owner._id, `${owner.firstName} ${owner.lastName}`])
  )

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
