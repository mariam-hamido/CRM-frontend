import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function NotificationLoading() {
  return (
    <Card>
      <CardContent className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        Loading notifications…
      </CardContent>
    </Card>
  )
}