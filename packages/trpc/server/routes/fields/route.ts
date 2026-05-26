import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../../trpc";
import { formFieldService } from "../../services";
import { FIELD_DEFINITIONS } from "@repo/shared";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["FIELDS"];
const getPath = generatePath("/fields");

const fieldInputSchema = z.object({
  type: z.enum(
    Object.keys(FIELD_DEFINITIONS) as [string, ...string[]]
  ),
  label: z.string().min(1).max(500),
  placeholder: z.string().max(500).optional(),
  description: z.string().optional(),
  required: z.boolean().default(false),
  orderIndex: z.number().int().min(0),
  options: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
        orderIndex: z.number().int(),
      })
    )
    .optional(),
});

export const fieldsRouter = router({
  /**
   * Replace all fields
   */
  upsertMany: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/upsert"),
        tags: TAGS,
      },
    })
    .input(
      z.object({
        formId: z.uuid(),
        fields: z.array(fieldInputSchema),
      })
    )
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      try {
        await formFieldService.upsertFieldsByForm(
          {
            formId: input.formId,
            fields: input.fields.map((f) => ({
              formId: input.formId,
              ...f,
            })),
          },
          ctx.user.id
        );

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: String(error),
        });
      }
    }),

  /**
   * Get fields by form
   */
  getByForm: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/get-by-form"),
        tags: TAGS,
      },
    })
    .input(
      z.object({
        formId: z.uuid(),
      })
    )
    .output(z.unknown())
    .query(async ({ input, ctx }) => {
      try {
        return await formFieldService.getFieldsByFormId(
          input.formId,
          ctx.user.id
        );
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: String(error),
        });
      }
    }),

  /**
   * Create field
   */
  create: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/create"),
        tags: TAGS,
      },
    })
    .input(
      z.object({
        formId: z.uuid(),
        ...fieldInputSchema.shape,
      })
    )
    .output(z.unknown())
    .mutation(async ({ input, ctx }) => {
      try {
        return await formFieldService.createField(
          input,
          ctx.user.id
        );
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: String(error),
        });
      }
    }),

  /**
   * Get field by ID
   */
  getById: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/get/:id"),
        tags: TAGS,
      },
    })
    .input(
      z.object({
        id: z.uuid(),
      })
    )
    .output(z.unknown())
    .query(async ({ input, ctx }) => {
      try {
        return await formFieldService.getFieldById(
          input.id,
          ctx.user.id
        );
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: String(error),
        });
      }
    }),

  /**
   * Update field
   */
  update: protectedProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: getPath("/update/:id"),
        tags: TAGS,
      },
    })
    .input(
      z.object({
        id: z.uuid(),
        ...fieldInputSchema.shape,
      })
    )
    .output(z.unknown())
    .mutation(async ({ input, ctx }) => {
      try {
        return await formFieldService.updateField(
          input,
          ctx.user.id
        );
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: String(error),
        });
      }
    }),

  /**
   * Delete field
   */
  delete: protectedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/delete/:id"),
        tags: TAGS,
      },
    })
    .input(
      z.object({
        id: z.uuid(),
      })
    )
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      try {
        await formFieldService.deleteField(
          input.id,
          ctx.user.id
        );

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: String(error),
        });
      }
    }),
});