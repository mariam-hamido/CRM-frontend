import type { PipelineStageFormValues } from '@/features/pipelines/schemas/pipelineStage.schema'
import type {
  CreatePipelineStagePayload,
  PipelineStage,
  UpdatePipelineStagePayload,
} from '@/features/pipelines/types/pipelineStage.types'

export function pipelineStageToFormValues(
  stage: PipelineStage
): PipelineStageFormValues {
  return {
    name: stage.name,
    description: stage.description ?? '',
    order: String(stage.order),
    color: stage.color ?? '',
    probability:
      stage.probability !== undefined && stage.probability !== 0
        ? String(stage.probability)
        : '',
    isWonStage: stage.isWonStage,
    isLostStage: stage.isLostStage,
  }
}

export function toCreatePipelineStagePayload(
  values: PipelineStageFormValues,
  pipelineId: string
): CreatePipelineStagePayload {
  return {
    pipeline: pipelineId,
    name: values.name,
    ...(values.order ? { order: Number(values.order) } : {}),
    ...(values.description ? { description: values.description } : {}),
    ...(values.color ? { color: values.color } : {}),
    ...(values.probability ? { probability: Number(values.probability) } : {}),
    isWonStage: values.isWonStage,
    isLostStage: values.isLostStage,
  }
}

export function toUpdatePipelineStagePayload(
  values: PipelineStageFormValues
): UpdatePipelineStagePayload {
  return {
    name: values.name,
    ...(values.order ? { order: Number(values.order) } : {}),
    ...(values.description ? { description: values.description } : {}),
    ...(values.color ? { color: values.color } : {}),
    ...(values.probability ? { probability: Number(values.probability) } : {}),
    isWonStage: values.isWonStage,
    isLostStage: values.isLostStage,
  }
}
