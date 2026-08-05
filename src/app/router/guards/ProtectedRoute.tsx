import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/app/router/routeConstants'
import type { AuthRedirectState } from '@/app/router/routeConstants'
import {
  selectIsAuthenticated,
  useAuthStore,
} from '@/features/auth/store/authStore'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    const redirectState: AuthRedirectState = {
      from: `${location.pathname}${location.search}`,
    }

    return <Navigate to={ROUTES.login} replace state={redirectState} />
  }

  return <Outlet />
}
