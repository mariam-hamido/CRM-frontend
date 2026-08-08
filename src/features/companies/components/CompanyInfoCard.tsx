import type { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface CompanyInfoRow {
  label: string
  value: ReactNode
}

export function CompanyInfoCard({
  title,
  description,
  rows,
  className,
}: {
  title: string
  description?: string
  rows: CompanyInfoRow[]
  className?: string
}) {
  if (rows.length === 0) return null

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label} className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {row.label}
              </dt>
              <dd className="min-w-0 break-words text-sm">{row.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
