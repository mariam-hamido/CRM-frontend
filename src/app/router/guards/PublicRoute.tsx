import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '@/app/router/routeConstants'
import {
  selectIsAuthenticated,
  useAuthStore,
} from '@/features/auth/store/authStore'

export function PublicRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)

  if (isAuthenticated) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return <Outlet />
}
