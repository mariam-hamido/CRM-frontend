import { Bell, Menu, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { UserMenu } from '@/components/layout/UserMenu'
import { ROUTES } from '@/app/router/routeConstants'
import { useUnreadCount } from '@/features/notifications/hooks/useUnreadCount'

const MAX_BADGE_COUNT = 99

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate()
  const unreadCountQuery = useUnreadCount()
  const unreadCount = unreadCountQuery.data?.count ?? 0
  const showBadge = unreadCount > 0
  const badgeLabel =
    unreadCount > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : String(unreadCount)

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
          className="relative"
          aria-label={
            showBadge
              ? `Notifications, ${unreadCount} unread`
              : 'Notifications'
          }
          onClick={() => void navigate(ROUTES.notifications)}
        >
          <Bell aria-hidden="true" />
          {showBadge ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-0.5 -right-0.5 z-10 inline-flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] leading-none font-semibold text-primary-foreground ring-2 ring-background"
            >
              {badgeLabel}
            </span>
          ) : null}
          {showBadge ? (
            <span className="sr-only">
              {unreadCount} unread{' '}
              {unreadCount === 1 ? 'notification' : 'notifications'}
            </span>
          ) : null}
        </Button>

        <UserMenu />
      </div>
    </header>
  )
}