import type { PipelineFormValues } from '@/features/pipelines/schemas/pipeline.schema'
import type {
  CreatePipelinePayload,
  Pipeline,
  UpdatePipelinePayload,
} from '@/features/pipelines/types/pipeline.types'

export function pipelineToFormValues(pipeline: Pipeline): PipelineFormValues {
  return {
    name: pipeline.name,
    description: pipeline.description ?? '',
    color: pipeline.color ?? '',
    isDefault: pipeline.isDefault,
  }
}

export function toCreatePipelinePayload(
  values: PipelineFormValues
): CreatePipelinePayload {
  return {
    name: values.name,
    ...(values.description ? { description: values.description } : {}),
    ...(values.color ? { color: values.color } : {}),
    isDefault: values.isDefault,
  }
}

export function toUpdatePipelinePayload(
  values: PipelineFormValues
): UpdatePipelinePayload {
  return {
    name: values.name,
    ...(values.description ? { description: values.description } : {}),
    ...(values.color ? { color: values.color } : {}),
    isDefault: values.isDefault,
  }
}
