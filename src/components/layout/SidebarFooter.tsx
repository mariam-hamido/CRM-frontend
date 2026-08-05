import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function SidebarFooter({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-t p-2">
      <Button
        type="button"
        variant="ghost"
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className={cn(
          'h-8 w-full justify-start gap-2.5 rounded-lg px-2 text-sm font-medium text-muted-foreground',
          collapsed && 'justify-center px-0'
        )}
      >
        {collapsed ? (
          <PanelLeftOpen className="size-4 shrink-0" aria-hidden="true" />
        ) : (
          <>
            <PanelLeftClose className="size-4 shrink-0" aria-hidden="true" />
            Collapse
          </>
        )}
      </Button>
    </div>
  )
}
