import { Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function LeadEmpty({
  onAdd,
}: {
  onAdd: () => void
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
          <Users className="size-5 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium">No leads yet</p>
          <p className="text-sm text-muted-foreground">
            Add a lead to start tracking potential customers.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={onAdd}>
          <Plus aria-hidden="true" />
          Add lead
        </Button>
      </CardContent>
    </Card>
  )
}
