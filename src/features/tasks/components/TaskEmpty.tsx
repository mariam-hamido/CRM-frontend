import { ListChecks, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function TaskEmpty({
  onAdd,
}: {
  onAdd?: () => void
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
          <ListChecks
            className="size-5 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium">No tasks yet</p>
          <p className="text-sm text-muted-foreground">
            Add a task to start tracking your work.
          </p>
        </div>
        {onAdd ? (
          <Button type="button" variant="outline" onClick={onAdd}>
            <Plus aria-hidden="true" />
            Add task
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
