import { pgTable, uuid, varchar, text, boolean, integer, jsonb, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { formsTable } from './form';

export const formFields = pgTable('form_fields', {
  id: uuid('id').primaryKey().defaultRandom(),
  formId: uuid('form_id').notNull().references(() => formsTable.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(),
  label: varchar('label', { length: 500 }).notNull(),
  placeholder: varchar('placeholder', { length: 500 }),
  description: text('description'),
  required: boolean('required').default(false).notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  formOrderIdx: index('fields_form_order_idx').on(t.formId, t.orderIndex),
}))

export const fieldOptions = pgTable('field_options', {
  id: uuid('id').primaryKey().defaultRandom(),
  fieldId: uuid('field_id').notNull().references(() => formFields.id, { onDelete: 'cascade' }),
  label: varchar('label', { length: 255 }).notNull(),
  value: varchar('value', { length: 255 }).notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  fieldOrderIdx: index('options_field_order_idx').on(t.fieldId, t.orderIndex),
}))

// Relations
export const formFieldsRelations = relations(formFields, ({ one, many }) => ({
  form: one(formsTable, {
    fields: [formFields.formId],
    references: [formsTable.id],
  }),
  options: many(fieldOptions),
}))

export const fieldOptionsRelations = relations(fieldOptions, ({ one }) => ({
  field: one(formFields, {
    fields: [fieldOptions.fieldId],
    references: [formFields.id],
  }),
}))

// Types
export type SelectFormFieldDBType = typeof formFields.$inferSelect;
export type InsertFormFieldDBType = typeof formFields.$inferInsert;

export type SelectFieldOptionDBType = typeof fieldOptions.$inferSelect;
export type InsertFieldOptionDBType = typeof fieldOptions.$inferInsert;