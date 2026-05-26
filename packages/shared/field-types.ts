import { z } from 'zod'

export const FIELD_DEFINITIONS = {
  short_text: {
    label: 'Short Text',
    icon: 'type',
    category: 'text',
    hasOptions: false,
    buildAnswerSchema: (_options: string[]) =>
      z.string().min(1, 'This field is required').max(500),
  },
  long_text: {
    label: 'Long Text',
    icon: 'align-left',
    category: 'text',
    hasOptions: false,
    buildAnswerSchema: (_options: string[]) =>
      z.string().min(1, 'This field is required').max(5000),
  },
  email: {
    label: 'Email',
    icon: 'mail',
    category: 'contact',
    hasOptions: false,
    buildAnswerSchema: (_options: string[]) =>
      z.email('Please enter a valid email'),
  },
  number: {
  label: 'Number',
  icon: 'hash',
  category: 'text',
  hasOptions: false,
  buildAnswerSchema: (_options: string[]) =>
    z.string()
      .transform((val) => Number(val))
      .pipe(
        z.number({
          error: 'Must be a number',
        })
      ),
},
  rating: {
    label: 'Rating',
    icon: 'star',
    category: 'scale',
    hasOptions: false,
    buildAnswerSchema: (_options: string[]) =>
      z.number().int().min(1).max(5),
  },
  date: {
    label: 'Date',
    icon: 'calendar',
    category: 'text',
    hasOptions: false,
    buildAnswerSchema: (_options: string[]) =>
      z.date('Please enter a valid date'),
  },
  checkbox: {
    label: 'Checkbox',
    icon: 'check-square',
    category: 'choice',
    hasOptions: false,
    buildAnswerSchema: (_options: string[]) =>
      z.boolean(),
  },
  single_select: {
    label: 'Single Select',
    icon: 'circle-dot',
    category: 'choice',
    hasOptions: true,
    buildAnswerSchema: (options: string[]) => {
      if (options.length === 0) return z.string()
      return z.enum(options as [string, ...string[]])
    },
  },
  multi_select: {
    label: 'Multi Select',
    icon: 'list',
    category: 'choice',
    hasOptions: true,
    buildAnswerSchema: (options: string[]) => {
      if (options.length === 0) return z.array(z.string()).min(1)
      return z.array(z.enum(options as [string, ...string[]])).min(1)
    },
  },
  dropdown: {
    label: 'Dropdown',
    icon: 'chevron-down',
    category: 'choice',
    hasOptions: true,
    buildAnswerSchema: (options: string[]) => {
      if (options.length === 0) return z.string()
      return z.enum(options as [string, ...string[]])
    },
  },
} as const

export type FieldType = keyof typeof FIELD_DEFINITIONS

export const FIELD_TYPES = Object.entries(FIELD_DEFINITIONS).map(
  ([type, def]) => ({
    type: type as FieldType,
    label: def.label,
    icon: def.icon,
    category: def.category,
    hasOptions: def.hasOptions,
  })
)