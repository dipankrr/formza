import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

const authMiddleware =
    tRPCContext.middleware<any>(
        async ({ ctx, next }) => {

            console.log(" auth middleware called ", ctx.user);

            if (!ctx.user) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message:"Please login"
                });
            }

            return next({
                ctx: {
                    ...ctx,
                    user: ctx.user
                }
            });

        });

export const protectedProcedure= publicProcedure.use(authMiddleware);