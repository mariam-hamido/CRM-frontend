import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { GENERIC_API_ERROR_MESSAGE } from '@/api/interceptors'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { SelectField } from '@/components/ui/select-field'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import {
  PipelineColorDot,
  PipelineDefaultBadge,
  PipelineDeleteDialog,
  PipelineDialog,
  PipelineEmpty,
  PipelineList,
  PipelineListError,
  PipelineListLoading,
  PipelineStageDeleteDialog,
  PipelineStageDialog,
  PipelineStageEmpty,
  PipelineStageError,
  PipelineStageList,
  PipelineStageLoading,
} from '@/features/pipelines/components'
import { usePipelines } from '@/features/pipelines/hooks/usePipelines'
import { usePipelineStagesByPipeline } from '@/features/pipelines/hooks/usePipelineStages'
import type { Pipeline } from '@/features/pipelines/types/pipeline.types'
import type { PipelineStage } from '@/features/pipelines/types/pipelineStage.types'

const PAGE_SIZE = 10

type DefaultFilter = 'all' | 'default'

export default function PipelinesPage() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [defaultFilter, setDefaultFilter] = useState<DefaultFilter>('all')
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null)
  const [pipelineToDelete, setPipelineToDelete] = useState<Pipeline | null>(null)
  const [stageFormOpen, setStageFormOpen] = useState(false)
  const [editingStage, setEditingStage] = useState<PipelineStage | null>(null)
  const [stageToDelete, setStageToDelete] = useState<PipelineStage | null>(null)

  const search = useDebouncedValue(searchInput, 300)

  useEffect(() => {
    setPage(1)
  }, [search, defaultFilter])

  const pipelinesQuery = usePipelines({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    isDefault: defaultFilter === 'default' ? true : undefined,
    sortBy: 'name',
    sortOrder: 'asc',
  })

  const pipelines = pipelinesQuery.data?.pipelines ?? []
  const pagination = pipelinesQuery.data?.pagination
  const hasActiveFilters = Boolean(search || defaultFilter === 'default')
  const hasPipelines = pagination ? pagination.total > 0 : pipelines.length > 0

  const stagesQuery = usePipelineStagesByPipeline(
    selectedPipeline?._id ?? undefined
  )
  const stages = stagesQuery.data?.stages ?? []

  useEffect(() => {
    if (selectedPipeline) return
    if (pipelinesQuery.isPending) return
    const current = pipelinesQuery.data?.pipelines ?? []
    if (current.length === 0) return
    const next = current.find((pipeline) => pipeline.isDefault) ?? current[0]
    setSelectedPipeline(next)
  }, [selectedPipeline, pipelinesQuery.data, pipelinesQuery.isPending])

  const openCreateDialog = () => {
    setEditingPipeline(null)
    setFormOpen(true)
  }

  const openEditDialog = (pipeline: Pipeline) => {
    setEditingPipeline(pipeline)
    setFormOpen(true)
  }

  const handlePipelineCreated = (pipeline: Pipeline) => {
    setSelectedPipeline(pipeline)
  }

  const handlePipelineDeleted = (id: string) => {
    setSelectedPipeline((current) =>
      current && current._id === id ? null : current
    )
  }

  const openCreateStageDialog = () => {
    setEditingStage(null)
    setStageFormOpen(true)
  }

  const openEditStageDialog = (stage: PipelineStage) => {
    setEditingStage(stage)
    setStageFormOpen(true)
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Pipelines
          </h1>
          <p className="text-sm text-muted-foreground">
            Organize your sales process with pipelines and stages.
          </p>
        </div>
        <Button type="button" onClick={openCreateDialog}>
          <Plus aria-hidden="true" />
          Add pipeline
        </Button>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search pipelines…"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="pl-9"
            aria-label="Search pipelines"
          />
        </div>

        <SelectField
          id="default-filter"
          aria-label="Filter by default pipeline"
          className="w-44"
          value={defaultFilter}
          onChange={(event) =>
            setDefaultFilter(event.target.value as DefaultFilter)
          }
        >
          <option value="all">All pipelines</option>
          <option value="default">Default only</option>
        </SelectField>
      </div>

      <section aria-label="Pipelines" className="space-y-4">
        {pipelinesQuery.isPending ? (
          <PipelineListLoading />
        ) : pipelinesQuery.isError ? (
          <PipelineListError
            message={pipelinesQuery.error?.message ?? GENERIC_API_ERROR_MESSAGE}
            onRetry={() => void pipelinesQuery.refetch()}
          />
        ) : pipelines.length === 0 ? (
          <PipelineEmpty
            hasActiveFilters={hasActiveFilters}
            onAdd={openCreateDialog}
          />
        ) : (
          <PipelineList
            pipelines={pipelines}
            selectedPipelineId={selectedPipeline?._id ?? null}
            onSelect={setSelectedPipeline}
            onEdit={openEditDialog}
            onDelete={setPipelineToDelete}
          />
        )}

        {hasPipelines && pagination ? (
          <Pagination
            pagination={pagination}
            onPageChange={setPage}
            itemLabel="pipelines"
          />
        ) : null}
      </section>

      <section aria-label="Selected pipeline" className="space-y-4">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="flex flex-wrap items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl">
              {selectedPipeline ? (
                <>
                  <PipelineColorDot color={selectedPipeline.color} />
                  <span className="min-w-0 truncate">
                    {selectedPipeline.name}
                  </span>
                  <PipelineDefaultBadge isDefault={selectedPipeline.isDefault} />
                </>
              ) : (
                <span>No pipeline selected</span>
              )}
            </h2>
            <p className="text-sm text-muted-foreground">
              {selectedPipeline
                ? stagesQuery.isPending
                  ? 'Loading stages…'
                  : `${stages.length} ${stages.length === 1 ? 'stage' : 'stages'}`
                : 'Select a pipeline to view and manage its stages.'}
            </p>
          </div>
          {selectedPipeline ? (
            <Button type="button" onClick={openCreateStageDialog}>
              <Plus aria-hidden="true" />
              Add stage
            </Button>
          ) : null}
        </header>

        {!selectedPipeline ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                <PipelineColorDot />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium">No pipeline selected</p>
                <p className="text-sm text-muted-foreground">
                  Select a pipeline from the list above to view and manage its
                  stages.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : stagesQuery.isPending ? (
          <PipelineStageLoading />
        ) : stagesQuery.isError ? (
          <PipelineStageError
            message={stagesQuery.error?.message ?? GENERIC_API_ERROR_MESSAGE}
            onRetry={() => void stagesQuery.refetch()}
          />
        ) : stages.length === 0 ? (
          <PipelineStageEmpty onAdd={openCreateStageDialog} />
        ) : (
          <PipelineStageList
            stages={stages}
            onEdit={openEditStageDialog}
            onDelete={setStageToDelete}
          />
        )}
      </section>

      <PipelineDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        pipeline={editingPipeline}
        onCreated={handlePipelineCreated}
      />

      <PipelineDeleteDialog
        open={Boolean(pipelineToDelete)}
        onOpenChange={(open) => {
          if (!open) setPipelineToDelete(null)
        }}
        pipeline={pipelineToDelete}
        onDeleted={handlePipelineDeleted}
      />

      <PipelineStageDialog
        open={stageFormOpen}
        onOpenChange={setStageFormOpen}
        pipelineId={selectedPipeline?._id ?? ''}
        stage={editingStage}
      />

      <PipelineStageDeleteDialog
        open={Boolean(stageToDelete)}
        onOpenChange={(open) => {
          if (!open) setStageToDelete(null)
        }}
        stage={stageToDelete}
      />
    </div>
  )
}
