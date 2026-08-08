import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { LeadSourceBadge } from '@/features/leads/components/LeadSourceBadge'
import { LeadStatusBadge } from '@/features/leads/components/LeadStatusBadge'
import type { Lead } from '@/features/leads/types/lead.types'
import { formatEstimatedValue } from '@/features/leads/utils/leadUtils'

export const LEAD_COLUMNS =
  'md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.3fr)_minmax(0,1.4fr)_auto_auto_auto_auto]'

function leadDisplayName(lead: Lead) {
  return lead.fullName || `${lead.firstName} ${lead.lastName}`
}

function LeadActions({
  lead,
  onEdit,
  onDelete,
}: {
  lead: Lead
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}) {
  const name = leadDisplayName(lead)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Actions for ${name}`}
        >
          <MoreHorizontal aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => onEdit(lead)}>
          <Pencil aria-hidden="true" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(lead)}>
          <Trash2 aria-hidden="true" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function LeadRow({
  lead,
  onEdit,
  onDelete,
}: {
  lead: Lead
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}) {
  const name = leadDisplayName(lead)

  return (
    <li className="border-b transition-colors last:border-0 hover:bg-muted/50">
      <div
        className={`hidden gap-4 px-4 py-3 sm:px-6 md:grid ${LEAD_COLUMNS}`}
      >
        <div className="min-w-0 truncate font-medium">{name}</div>
        <div className="hidden min-w-0 truncate text-muted-foreground lg:block">
          {lead.companyName ?? '—'}
        </div>
        <div className="hidden min-w-0 truncate text-muted-foreground xl:block">
          {lead.email ?? '—'}
        </div>
        <div>
          <LeadStatusBadge status={lead.status} />
        </div>
        <div className="hidden md:block">
          <LeadSourceBadge source={lead.source} />
        </div>
        <div className="hidden min-w-0 truncate text-muted-foreground md:block">
          {formatEstimatedValue(lead.estimatedValue)}
        </div>
        <div className="flex justify-end">
          <LeadActions lead={lead} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 py-3 sm:px-6 md:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="truncate font-medium">{name}</p>
            {lead.companyName ? (
              <p className="truncate text-sm text-muted-foreground">
                {lead.companyName}
              </p>
            ) : null}
          </div>
          <LeadActions lead={lead} onEdit={onEdit} onDelete={onDelete} />
        </div>
        {lead.email || lead.phone ? (
          <div className="flex flex-col gap-0.5 text-sm text-muted-foreground">
            {lead.email ? <p className="truncate">{lead.email}</p> : null}
            {lead.phone ? <p className="truncate">{lead.phone}</p> : null}
          </div>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          <LeadStatusBadge status={lead.status} />
          <LeadSourceBadge source={lead.source} />
        </div>
      </div>
    </li>
  )
}
