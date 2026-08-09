export function DealKanbanSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto">
      {[0, 1, 2, 3].map((column) => (
        <div
          key={column}
          className="flex w-72 shrink-0 flex-col gap-2 rounded-xl border bg-muted/30 p-2"
          aria-hidden="true"
        >
          <div className="flex items-center justify-between px-1 py-1.5">
            <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
            <div className="h-5 w-7 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="h-20 animate-pulse rounded-lg bg-muted" />
          <div className="h-20 animate-pulse rounded-lg bg-muted" />
        </div>
      ))}
    </div>
  )
}
