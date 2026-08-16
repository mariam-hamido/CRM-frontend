import { CalendarDays, Plus, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function MeetingEmpty({
  onAdd,
  onClearFilters,
  hasActiveFilters = false,
}: {
  onAdd?: () => void
  onClearFilters?: () => void
  hasActiveFilters?: boolean
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
          {hasActiveFilters ? (
            <TriangleAlert
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />
          ) : (
            <CalendarDays
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium">
            {hasActiveFilters ? 'No meetings found' : 'No meetings yet'}
          </p>
          <p className="text-sm text-muted-foreground">
            {hasActiveFilters
              ? 'No meetings match your current filters. Try adjusting your search or filters.'
              : 'Add a meeting to start scheduling your work.'}
          </p>
        </div>
        {hasActiveFilters && onClearFilters ? (
          <Button type="button" variant="outline" onClick={onClearFilters}>
            Clear filters
          </Button>
        ) : !hasActiveFilters && onAdd ? (
          <Button type="button" variant="outline" onClick={onAdd}>
            <Plus aria-hidden="true" />
            Add meeting
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
