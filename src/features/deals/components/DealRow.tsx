import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { DealStatusBadge } from '@/features/deals/components/DealStatusBadge'
import type { Deal } from '@/features/deals/types/deal.types'
import {
  formatDate,
  formatDealValue,
  formatProbability,
} from '@/features/deals/utils/dealUtils'

export const DEAL_COLUMNS =
  'md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_minmax(0,1.1fr)_auto_auto_auto_minmax(0,0.8fr)_auto]'

function DealActions({
  deal,
  onEdit,
  onDelete,
}: {
  deal: Deal
  onEdit: (deal: Deal) => void
  onDelete: (deal: Deal) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Actions for ${deal.title}`}
        >
          <MoreHorizontal aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => onEdit(deal)}>
          <Pencil aria-hidden="true" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(deal)}>
          <Trash2 aria-hidden="true" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function DealRow({
  deal,
  customerName,
  pipelineName,
  stageName,
  ownerName,
  onEdit,
  onDelete,
}: {
  deal: Deal
  customerName?: string
  pipelineName?: string
  stageName?: string
  ownerName?: string
  onEdit: (deal: Deal) => void
  onDelete: (deal: Deal) => void
}) {
  return (
    <li className="border-b transition-colors last:border-0 hover:bg-muted/50">
      <div
        className={`hidden items-center gap-4 px-4 py-3 sm:px-6 md:grid ${DEAL_COLUMNS}`}
      >
        <div className="min-w-0 truncate font-medium">{deal.title}</div>
        <div className="hidden min-w-0 truncate text-muted-foreground lg:block">
          {customerName ?? '—'}
        </div>
        <div className="hidden min-w-0 truncate text-muted-foreground md:block">
          {stageName ?? '—'}
        </div>
        <div className="tabular-nums text-muted-foreground">
          {formatDealValue(deal.value)}
        </div>
        <div className="hidden tabular-nums text-muted-foreground md:block">
          {formatProbability(deal.probability)}
        </div>
        <div className="hidden text-muted-foreground xl:block">
          {formatDate(deal.expectedCloseDate)}
        </div>
        <div className="hidden min-w-0 truncate text-muted-foreground lg:block">
          {ownerName ?? '—'}
        </div>
        <div className="flex justify-end">
          <DealActions deal={deal} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 py-3 sm:px-6 md:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="truncate font-medium">{deal.title}</p>
            <p className="truncate text-sm text-muted-foreground">
              {customerName ?? '—'}
            </p>
          </div>
          <DealActions deal={deal} onEdit={onEdit} onDelete={onDelete} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DealStatusBadge status={deal.status} />
          {pipelineName || stageName ? (
            <span className="text-sm text-muted-foreground">
              {[pipelineName, stageName].filter(Boolean).join(' · ')}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-0.5 text-sm text-muted-foreground">
          <p className="tabular-nums">
            {formatDealValue(deal.value)} · {formatProbability(deal.probability)}
          </p>
          {ownerName ? <p className="truncate">{ownerName}</p> : null}
        </div>
      </div>
    </li>
  )
}
