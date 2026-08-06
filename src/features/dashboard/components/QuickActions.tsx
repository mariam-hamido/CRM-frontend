import type { QuickActionItem } from '@/features/dashboard/constants/mockData'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function QuickActions({
  actions,
  className,
}: {
  actions: QuickActionItem[]
  className?: string
}) {
  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.id}
              variant={action.variant}
              className="justify-start"
            >
              <Icon />
              {action.label}
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
