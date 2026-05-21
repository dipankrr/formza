// import {TRPCError} from "@trpc/server";
// import {tRPCContext} from "./trpc";

// export const authMiddleware =
//     tRPCContext.middleware<any>(
//         async ({ ctx, next }) => {

//             if (!ctx.user) {
//                 throw new TRPCError({
//                     code: "UNAUTHORIZED",
//                     message:"Please login"
//                 });
//             }

//             return next({
//                 ctx: {
//                     ...ctx,
//                     user: ctx.user
//                 }
//             });

//         });