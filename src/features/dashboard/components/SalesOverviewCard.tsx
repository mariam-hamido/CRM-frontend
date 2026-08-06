import { TrendingUp } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function SalesOverviewCard({ className }: { className?: string }) {
  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Revenue performance over time</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center">
        <div className="flex min-h-56 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground">
          <TrendingUp className="size-8" aria-hidden="true" />
          <p className="text-sm font-medium">Sales chart coming soon</p>
        </div>
      </CardContent>
    </Card>
  )
}
