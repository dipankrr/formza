import { z } from 'zod'
import { FIELD_DEFINITIONS, FieldType } from './field-types'

type FieldWithOptions = {
  id: string
  type: string
  required: boolean
  options: { value: string }[]
}

export function buildSubmissionValidator(fields: FieldWithOptions[]) {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const field of fields) {
    const definition = FIELD_DEFINITIONS[field.type as FieldType]
    if (!definition) continue

    const optionValues = field.options.map(o => o.value)
    let schema: z.ZodTypeAny = definition.buildAnswerSchema(optionValues)

    if (!field.required) {
      schema = schema.optional()
    }

    shape[field.id] = schema
  }

  return z.object(shape)
}