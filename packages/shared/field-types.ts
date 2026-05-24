import { z } from 'zod'

type FieldDefinition = {
  meta: {
    label: string
    icon: string
    category: string
    premium: boolean
  }

  configSchema: z.ZodTypeAny

  buildAnswerSchema: (
    config: any,
    options?: any
  ) => z.ZodTypeAny
}
type FieldDefinitionMap = Record<string, FieldDefinition>

export const FIELD_DEFINITIONS = {

  short_text: {
    // Stage 1: what frontend needs to render the config panel
    meta: {
      label: 'Short Text',
      icon: 'type',
      category: 'text',
      premium: false,
    },
    // Stage 2: validates what CREATOR sends when configuring the field
    configSchema: z.object({
      maxLength: z.number().int().min(1).max(10000).default(500),
      minLength: z.number().int().min(0).max(9999).default(0),
      pattern: z.string().optional(),
    }),
    // Stage 3: takes saved config, returns validator for RESPONDENT answer
    buildAnswerSchema: (config: { maxLength: number; minLength: number }) =>
      z.string().min(config.minLength).max(config.maxLength),
  },

  email: {
    meta: {
      label: 'Email',
      icon: 'mail',
      category: 'contact',
      premium: false,
    },
    configSchema: z.object({}), // email has no creator config
    buildAnswerSchema: () => z.string().email(),
  },

  rating: {
    meta: {
      label: 'Rating',
      icon: 'star',
      category: 'scale',
      premium: false,
    },
    configSchema: z.object({
      max: z.number().int().min(2).max(10).default(5),
      shape: z.enum(['star', 'number', 'heart']).default('star'),
    }),
    buildAnswerSchema: (config: { max: number }) =>
      z.number().int().min(1).max(config.max),
  },

  single_select: {
    meta: {
      label: 'Single Select',
      icon: 'circle-dot',
      category: 'choice',
      premium: false,
    },
    configSchema: z.object({
      randomize: z.boolean().default(false),
    }),
    // options are separate — passed in from field_options table
    buildAnswerSchema: (config: {}, options: string[]) =>
      z.enum(options as [string, ...string[]]),
  },

  number: {
    meta: {
      label: 'Number',
      icon: 'hash',
      category: 'text',
      premium: false,
    },
    configSchema: z.object({
      min: z.number().min(-999999).max(999999).optional(),
      max: z.number().min(-999999).max(999999).optional(),
    }).refine(
      data => data.min === undefined || data.max === undefined || data.min < data.max,
      { message: 'min must be less than max' }
    ),
    buildAnswerSchema: (config: { min?: number; max?: number }) => {
      let schema = z.number()
      if (config.min !== undefined) schema = schema.min(config.min)
      if (config.max !== undefined) schema = schema.max(config.max)
      return schema
    },
  },

} satisfies FieldDefinitionMap;  // TypeScript ensures every key has all three