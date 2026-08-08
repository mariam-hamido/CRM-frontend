import * as React from "react"
import { ChevronDown } from "lucide-react"

import { FormErrorMessage } from "@/features/auth/components"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface SelectFieldProps
  extends Omit<React.ComponentProps<"select">, "id"> {
  id: string
  label?: string
  error?: string
  hint?: string
}

export function SelectField({
  id,
  label,
  error,
  hint,
  className,
  children,
  ...props
}: SelectFieldProps) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label ? <Label htmlFor={id}>{label}</Label> : null}

      <div className="relative">
        <select
          {...props}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            "h-8 w-full min-w-0 appearance-none rounded-lg border border-input bg-transparent px-2.5 py-1 pr-8 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
            className
          )}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </div>

      {hint ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}

      <FormErrorMessage message={error} id={errorId} />
    </div>
  )
}
