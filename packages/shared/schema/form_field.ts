import { z } from 'zod'
import { FIELD_DEFINITIONS } from '../field-types'

export const fieldInputSchema = z.object({
  type: z.enum(Object.keys(FIELD_DEFINITIONS) as [string, ...string[]]),
  label: z.string().min(1).max(500),
  placeholder: z.string().max(500).optional(),
  description: z.string().optional(),
  required: z.boolean().default(false),
  orderIndex: z.number().int().min(0),
  options: z.array(z.object({
    label: z.string().min(1),
    value: z.string().min(1),
    orderIndex: z.number().int(),
  })).optional(),
})

export type FieldInputType = z.input<typeof fieldInputSchema>
export type FieldOutputType = z.output<typeof fieldInputSchema>