import { Plus, Target, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function DealEmpty({
  onAdd,
  hasActiveFilters = false,
}: {
  onAdd: () => void
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
            <Target className="size-5 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium">
            {hasActiveFilters ? 'No deals found' : 'No deals yet'}
          </p>
          <p className="text-sm text-muted-foreground">
            {hasActiveFilters
              ? 'Try adjusting your search or filters.'
              : 'Add a deal to start tracking your sales pipeline.'}
          </p>
        </div>
        {!hasActiveFilters ? (
          <Button type="button" variant="outline" onClick={onAdd}>
            <Plus aria-hidden="true" />
            Add deal
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
