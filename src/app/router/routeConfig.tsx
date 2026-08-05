import { Suspense } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { PublicLayout } from '@/app/layouts/PublicLayout'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProtectedRoute, PublicRoute } from '@/app/router/guards'
import {
  DashboardPage,
  LoginPage,
  NotFoundPage,
  RegisterPage,
} from '@/app/router/lazyPages'
import { ROUTES } from '@/app/router/routeConstants'
import { LoadingFallback } from '@/components/shared/LoadingFallback'

export const routeConfig: RouteObject[] = [
  {
    path: ROUTES.home,
    element: <Navigate to={ROUTES.login} replace />,
  },
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: ROUTES.login,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <LoginPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.register,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <RegisterPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: ROUTES.dashboard,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <DashboardPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    element: <PublicLayout />,
    children: [
      {
        path: ROUTES.notFound,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]
