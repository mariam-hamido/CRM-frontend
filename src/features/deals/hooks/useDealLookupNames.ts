import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getCustomer } from '@/features/customers/api/customerApi'
import { customerDetailQueryKey } from '@/features/customers/hooks/useGetCustomers'
import type { Customer } from '@/features/customers/types/customer.types'
import type { Deal } from '@/features/deals/types/deal.types'
import { getPipeline } from '@/features/pipelines/api/pipelineApi'
import { getPipelineStagesByPipeline } from '@/features/pipelines/api/pipelineStageApi'
import {
  pipelineDetailQueryKey,
  pipelineStagesByPipelineQueryKey,
} from '@/features/pipelines/hooks/pipelineKeys'
import type { Pipeline } from '@/features/pipelines/types/pipeline.types'
import type { PipelineStage } from '@/features/pipelines/types/pipelineStage.types'

export interface DealLookupNames {
  customerNames: Map<string, string>
  pipelineNames: Map<string, string>
  stageNames: Map<string, string>
}

export function useDealLookupNames({
  deals,
  customers = [],
  pipelines = [],
  stages = [],
}: {
  deals: Deal[]
  customers?: Customer[]
  pipelines?: Pipeline[]
  stages?: PipelineStage[]
}): DealLookupNames {
  const customerIds = useMemo(
    () => Array.from(new Set(deals.map((deal) => deal.customer))),
    [deals]
  )
  const pipelineIds = useMemo(
    () => Array.from(new Set(deals.map((deal) => deal.pipeline))),
    [deals]
  )

  const cachedCustomerIds = useMemo(
    () => new Set(customers.map((customer) => customer._id)),
    [customers]
  )
  const cachedPipelineIds = useMemo(
    () => new Set(pipelines.map((pipeline) => pipeline._id)),
    [pipelines]
  )

  const missingCustomerIds = useMemo(
    () => customerIds.filter((id) => !cachedCustomerIds.has(id)),
    [customerIds, cachedCustomerIds]
  )
  const missingPipelineIds = useMemo(
    () => pipelineIds.filter((id) => !cachedPipelineIds.has(id)),
    [pipelineIds, cachedPipelineIds]
  )

  const customerQueries = useQueries({
    queries: missingCustomerIds.map((id) => ({
      queryKey: customerDetailQueryKey(id),
      queryFn: async () => {
        const response = await getCustomer(id)
        return response.data
      },
    })),
  })

  const pipelineQueries = useQueries({
    queries: missingPipelineIds.map((id) => ({
      queryKey: pipelineDetailQueryKey(id),
      queryFn: async () => {
        const response = await getPipeline(id)
        return response.data
      },
    })),
  })

  const stageQueries = useQueries({
    queries: pipelineIds.map((id) => ({
      queryKey: pipelineStagesByPipelineQueryKey(id),
      queryFn: async () => {
        const response = await getPipelineStagesByPipeline(id)
        return response.data
      },
    })),
  })

  const customerNames = useMemo(() => {
    const names = new Map<string, string>()
    for (const customer of customers) {
      names.set(customer._id, customer.companyName)
    }
    for (const query of customerQueries) {
      if (query.data) {
        names.set(query.data._id, query.data.companyName)
      }
    }
    return names
  }, [customers, customerQueries])

  const pipelineNames = useMemo(() => {
    const names = new Map<string, string>()
    for (const pipeline of pipelines) {
      names.set(pipeline._id, pipeline.name)
    }
    for (const query of pipelineQueries) {
      if (query.data) {
        names.set(query.data._id, query.data.name)
      }
    }
    return names
  }, [pipelines, pipelineQueries])

  const stageNames = useMemo(() => {
    const names = new Map<string, string>()
    for (const stage of stages) {
      names.set(stage._id, stage.name)
    }
    for (const query of stageQueries) {
      if (query.data) {
        for (const stage of query.data.stages) {
          names.set(stage._id, stage.name)
        }
      }
    }
    return names
  }, [stages, stageQueries])

  return { customerNames, pipelineNames, stageNames }
}
