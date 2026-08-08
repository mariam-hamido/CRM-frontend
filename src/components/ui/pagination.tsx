import { Button } from '@/components/ui/button'
import type { Pagination } from '@/types/api'

export function Pagination({
  pagination,
  onPageChange,
  itemLabel = 'contacts',
}: {
  pagination: Pagination
  onPageChange: (page: number) => void
  itemLabel?: string
}) {
  if (pagination.totalPages <= 1) return null

  const { page, totalPages } = pagination
  const firstItem = (page - 1) * pagination.limit + 1
  const lastItem = Math.min(page * pagination.limit, pagination.total)

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing{' '}
        <span className="font-medium text-foreground">
          {firstItem}–{lastItem}
        </span>{' '}
        of{' '}
        <span className="font-medium text-foreground">{pagination.total}</span>{' '}
        {itemLabel}
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <span className="px-1 text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
