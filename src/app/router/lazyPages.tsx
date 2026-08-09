import { lazy } from 'react'

export const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
export const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
export const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'))
export const CompaniesPage = lazy(() => import('@/features/companies/pages/CompaniesPage'))
export const CompanySettingsPage = lazy(() => import('@/features/companies/pages/CompanySettingsPage'))
export const CustomersPage = lazy(() => import('@/features/customers/pages/CustomersPage'))
export const CustomerDetailPage = lazy(() => import('@/features/customers/pages/CustomerDetailPage'))
export const LeadsPage = lazy(() => import('@/features/leads/pages/LeadsPage'))
export const DealsPage = lazy(() => import('@/features/deals/pages/DealsPage'))
export const DealDetailPage = lazy(() => import('@/features/deals/pages/DealDetailPage'))
export const PipelinesPage = lazy(() => import('@/features/pipelines/pages/PipelinesPage'))
export const NotFoundPage = lazy(() => import('@/app/pages/NotFoundPage'))
