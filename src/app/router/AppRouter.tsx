import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routeConfig } from '@/app/router/routeConfig'

const router = createBrowserRouter(routeConfig)

export function AppRouter() {
  return <RouterProvider router={router} />
}
