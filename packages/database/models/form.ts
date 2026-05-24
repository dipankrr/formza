import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

import {usersTable}  from "./user";
// import { themes } from "./themes";


// Enums

export const formStatusEnum = pgEnum("form_status", [
  "draft",
  "published",
]);

export const formVisibilityEnum = pgEnum("form_visibility", [
  "public",
  "unlisted",
]);



// Types

export type FormSettings = {
  notifyCreator?: boolean;
  allowEmailReceipt?: boolean;
  thankYouMessage?: string;
  oneResponsePerRespondent?: boolean;
};


// Table

export const formsTable = pgTable(
  "forms",
  {
    id: uuid("id")
      .primaryKey()
      .defaultRandom(),

    creatorId: uuid("creator_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),

    title: varchar("title", {
      length: 255,
    }).notNull(),

    description: text("description"),

    slug: varchar("slug", {
      length: 100,
    }),

    status: formStatusEnum("status")
      .default("draft")
      .notNull(),

    visibility: formVisibilityEnum("visibility")
      .default("unlisted")
      .notNull(),

    submissionCount: integer("submission_count")
      .default(0)
      .notNull(),

    expiresAt: timestamp("expires_at", {
      mode: "date",
    }),

    settings: jsonb("settings")
      .$type<FormSettings>()
      .default(sql`'{}'::jsonb`)
      .notNull(),

    createdAt: timestamp("created_at", {
      mode: "date",
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      mode: "date",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("forms_creator_created_idx").on(
      table.creatorId,
      table.createdAt
    ),

    // UNIQUE INDEX on slug WHERE slug IS NOT NULL
    uniqueIndex("forms_slug_unique")
      .on(table.slug)
      .where(sql`${table.slug} IS NOT NULL`),
  ]
);


export type SelectFormDBType = typeof formsTable.$inferSelect;
export type InsertFormDBType = typeof formsTable.$inferInsert;