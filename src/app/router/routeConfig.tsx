import { Suspense } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { PublicLayout } from '@/app/layouts/PublicLayout'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProtectedRoute, PublicRoute } from '@/app/router/guards'
import {
  CompaniesPage,
  CompanySettingsPage,
  CustomerDetailPage,
  CustomersPage,
  DashboardPage,
  DealDetailPage,
  DealsPage,
  LeadsPage,
  LoginPage,
  NotFoundPage,
  PipelinesPage,
  RegisterPage,
  TaskDetailPage,
  TasksPage,
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
          {
            path: ROUTES.companies,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <CompaniesPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.customers,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <CustomersPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.customersDetail,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <CustomerDetailPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.leads,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <LeadsPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.deals,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <DealsPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.dealsDetail,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <DealDetailPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.tasks,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <TasksPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.tasksDetail,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <TaskDetailPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.pipelines,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <PipelinesPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.settings,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <CompanySettingsPage />
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
