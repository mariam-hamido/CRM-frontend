import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { RealtimeNotificationsBridge } from '@/lib/realtime/RealtimeNotificationsBridge'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <RealtimeNotificationsBridge />
        {children}
        <Toaster />
      </QueryProvider>
    </ThemeProvider>
  )
}
