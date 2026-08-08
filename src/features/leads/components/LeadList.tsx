import { Card } from '@/components/ui/card'
import { LEAD_COLUMNS, LeadRow } from '@/features/leads/components/LeadRow'
import type { Lead } from '@/features/leads/types/lead.types'

export function LeadList({
  leads,
  onEdit,
  onDelete,
}: {
  leads: Lead[]
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}) {
  return (
    <Card>
      <div
        className={`hidden gap-4 border-b px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-6 md:grid ${LEAD_COLUMNS}`}
      >
        <span>Name</span>
        <span className="hidden lg:block">Company</span>
        <span className="hidden xl:block">Email</span>
        <span>Status</span>
        <span className="hidden md:block">Source</span>
        <span className="hidden md:block">Value</span>
        <span className="text-right">
          <span className="sr-only">Actions</span>
        </span>
      </div>
      <ul>
        {leads.map((lead) => (
          <LeadRow
            key={lead._id}
            lead={lead}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </Card>
  )
}
