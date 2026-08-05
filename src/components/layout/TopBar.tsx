import { Bell, Menu, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { UserMenu } from '@/components/layout/UserMenu'

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <Menu aria-hidden="true" />
      </Button>

      <Breadcrumbs />

      <div className="ml-auto flex items-center gap-1.5">
        <div
          aria-hidden="true"
          className="hidden h-8 w-56 items-center gap-2 rounded-lg bg-muted/60 px-2.5 text-sm text-muted-foreground md:flex"
        >
          <Search className="size-4 shrink-0" />
          <span className="flex-1">Search…</span>
          <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] lg:inline">
            ⌘K
          </kbd>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Notifications"
        >
          <Bell aria-hidden="true" />
        </Button>

        <UserMenu />
      </div>
    </header>
  )
}
