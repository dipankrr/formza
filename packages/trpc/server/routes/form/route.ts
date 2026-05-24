import { z, zodUndefinedModel } from "../../schema";
import { formService } from "../../services";
import { createFormSchema, formResponseSchema, getFormBySlugSchema, getFormSchema, updateFormSchema, type CreateFormInputType} from "@repo/shared";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { logger } from "../../../../logger";

const TAGS = ["FORM"];
const getPath = generatePath("/form");

export const formRouter = router({

  getAllFormsOfUser: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/get-all-form"), tags: TAGS } })
    .input(z.void())
    .output(z.array(formResponseSchema))
    .query(async ({ input, ctx }) => {
      return formService.getAllFormsOfUser(ctx.user.id);
    }),

  createForm: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/create-form"), tags: TAGS } })
    .input(createFormSchema)
    .output(formResponseSchema.optional())
    .mutation(async ({ input, ctx }) => {
      return await formService.createForm(input, ctx.user.id);
    }),

  
  // updateForm: protectedProcedure
  //   .meta({ openapi: { method: "POST", path: getPath("/update-form"), tags: TAGS } })
  //   .input(updateFormSchema)
  //   .output(formResponseSchema.optional())
  //   .mutation(async ({ input, ctx }) => {
  //     return await formService.updateForm(input, ctx.user.id);
  //   }),

  
})