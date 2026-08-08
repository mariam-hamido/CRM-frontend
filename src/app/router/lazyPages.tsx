import { lazy } from 'react'

export const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
export const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
export const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'))
export const CompaniesPage = lazy(() => import('@/features/companies/pages/CompaniesPage'))
export const CompanySettingsPage = lazy(() => import('@/features/companies/pages/CompanySettingsPage'))
export const NotFoundPage = lazy(() => import('@/app/pages/NotFoundPage'))
