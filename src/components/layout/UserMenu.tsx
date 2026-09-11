import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Settings, UserRound } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROUTES } from '@/app/router/routeConstants'
import {
  selectUser,
  useAuthStore,
} from '@/features/auth/store/authStore'
import { clearSession } from '@/features/auth/utils/authUtils'

export function UserMenu() {
  const user = useAuthStore(selectUser)
  const navigate = useNavigate()

  const initials = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
    : '?'
  const displayName = user
    ? `${user.firstName} ${user.lastName}`
    : 'Guest'

  const handleLogout = () => {
    clearSession()
    navigate(ROUTES.login)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          aria-label="Open user menu"
        >
          <Avatar size="sm">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5 py-0.5">
            <span className="text-sm font-medium text-foreground">
              {displayName}
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              {user?.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={ROUTES.profile}>
            <UserRound aria-hidden="true" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={ROUTES.settings}>
            <Settings aria-hidden="true" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
          <LogOut aria-hidden="true" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
