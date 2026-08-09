import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/app/router/routeConstants'
import { cn } from '@/lib/utils'
import { DealStatusBadge } from '@/features/deals/components/DealStatusBadge'
import type { Deal } from '@/features/deals/types/deal.types'
import {
  formatDate,
  formatDealValue,
  formatProbability,
} from '@/features/deals/utils/dealUtils'

export function DealKanbanCard({
  deal,
  customerName,
  ownerName,
  onEdit,
  onDelete,
}: {
  deal: Deal
  customerName?: string
  ownerName?: string
  onEdit: (deal: Deal) => void
  onDelete: (deal: Deal) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        'rounded-lg border bg-card p-3 shadow-sm',
        isDragging ? 'opacity-40' : 'hover:border-primary/40'
      )}
    >
      <div className="flex items-start gap-1.5">
        <Button
          ref={setActivatorNodeRef}
          type="button"
          variant="ghost"
          size="icon-sm"
          className="-ml-1 cursor-grab active:cursor-grabbing"
          aria-label={`Drag ${deal.title} to move it`}
          {...listeners}
        >
          <GripVertical aria-hidden="true" className="size-4 text-muted-foreground" />
        </Button>
        <Link
          to={ROUTES.dealsDetail.replace(':id', deal._id)}
          className="min-w-0 flex-1 truncate pt-1.5 font-medium hover:text-primary hover:underline"
        >
          {deal.title}
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="-mr-1"
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
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => onDelete(deal)}
            >
              <Trash2 aria-hidden="true" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col gap-1 pl-8 text-sm">
        <p className="truncate text-muted-foreground">{customerName ?? '—'}</p>
        <p className="tabular-nums font-medium">
          {formatDealValue(deal.value)}
          <span className="font-normal text-muted-foreground">
            {' '}· {formatProbability(deal.probability)}
          </span>
        </p>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-muted-foreground">
            {formatDate(deal.expectedCloseDate)}
          </p>
          <DealStatusBadge status={deal.status} />
        </div>
        {ownerName ? (
          <p className="truncate text-muted-foreground">{ownerName}</p>
        ) : null}
      </div>
    </li>
  )
}
