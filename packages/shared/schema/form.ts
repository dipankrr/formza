import { z } from "zod";


// ======================
// Reusable field schemas
// ======================

const formIdSchema = z.uuid();

const titleSchema = z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title cannot exceed 255 characters");

const descriptionSchema = z
    .string()
    .trim()
    .max(5000, "Description too long")
    .optional()
    .nullable();

const slugSchema = z
    .string()
    .trim()
    .min(5, "Slug must be at least 5 characters")
    .max(100)
    .regex(
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .optional()
    .nullable();

const statusSchema = z.enum([
    "draft",
    "published",
]);

const visibilitySchema = z.enum([
    "public",
    "unlisted",
]);

// const themeIdSchema = z
//     .uuid()
//     .optional()
//     .nullable();

const expiresAtSchema = z
    .date()
    .optional()
    .nullable();


// ======================
// Settings
// ======================

export const formSettingsSchema =
    z.object({
        notifyCreator: z
            .boolean()
            .default(false),

        allowEmailReceipt: z
            .boolean()
            .default(false),

        thankYouMessage: z
            .string()
            .trim()
            .max(
                1000,
                "Thank you message too long"
            )
            .optional(),

        oneResponsePerRespondent:
            z.boolean()
                .default(false),
    });


// ======================
// Create
// ======================

export const createFormSchema =
    z.object({
        title: titleSchema,
        description: descriptionSchema,
        slug: slugSchema.optional(),
        visibility:
            visibilitySchema
                .default("public"),
        expiresAt:
            expiresAtSchema.optional(),
            
        settings:
            formSettingsSchema
                .default({
                    notifyCreator: false,
                    allowEmailReceipt: false,
                    oneResponsePerRespondent: false,
                }),
    });


// ======================
// Update
// ======================

export const updateFormSchema =
    createFormSchema
        .partial()
        .extend({
            id: formIdSchema,
        }).strict();


// ======================
// Publish / Unpublish
// ======================

export const publishFormSchema =
    z.object({
        id: formIdSchema,
    });

export const unpublishFormSchema =
    z.object({
        id: formIdSchema,
    });


// ======================
// Delete
// ======================

export const deleteFormSchema =
    z.object({
        id: formIdSchema,
    });


// ======================
// Query params
// ======================

export const getFormSchema =
    z.object({
        id: formIdSchema,
    });

export const getFormBySlugSchema =
    z.object({
        slug: slugSchema.unwrap(),
    });


// ======================
// API response
// ======================

export const formResponseSchema =
    z.object({
        id: formIdSchema,
        creatorId: z.uuid(),
        title: titleSchema,
        description: descriptionSchema,
        slug: slugSchema,
        status: statusSchema,
        visibility: visibilitySchema,
        submissionCount: z.number(),
        expiresAt: z.date().nullable(),
        settings: formSettingsSchema,
        createdAt: z.date(),
        updatedAt: z.date(),
    });


// ======================
// Types
// ======================

export type CreateFormInputType = z.infer<typeof createFormSchema>;

export type UpdateFormInputType = z.infer<typeof updateFormSchema>;

export type PublishFormInputType = z.infer<typeof publishFormSchema>;

export type DeleteFormInputType = z.infer<typeof deleteFormSchema>;

export type GetFormInputType = z.infer<typeof getFormSchema>;

export type FormResponseType = z.infer<typeof formResponseSchema>;

export type FormSettingsType = z.infer<typeof formSettingsSchema>;