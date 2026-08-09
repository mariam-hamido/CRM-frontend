import { cn } from '@/lib/utils'

export function PipelineColorDot({ color }: { color?: string }) {
  return (
    <span
      className={cn(
        'size-2.5 shrink-0 rounded-full',
        !color && 'bg-muted-foreground/40'
      )}
      style={color ? { backgroundColor: color } : undefined}
      aria-hidden="true"
    />
  )
}
