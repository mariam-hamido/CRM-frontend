import { Badge } from '@/components/ui/badge'

export function PipelineStageResultBadge({
  isWonStage,
  isLostStage,
}: {
  isWonStage: boolean
  isLostStage: boolean
}) {
  if (isWonStage) {
    return (
      <Badge className="border-transparent bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
        <span aria-hidden="true">✓</span>
        Won
      </Badge>
    )
  }

  if (isLostStage) {
    return <Badge variant="destructive">Lost</Badge>
  }

  return null
}
