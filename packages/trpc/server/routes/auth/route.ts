import { z, zodUndefinedModel } from "../../schema";
import { userService } from "../../services";
import { getAuthenticationMethodOutputSchema, loginResponseSchema, logInSchema, registerSchema, userResponseSchema } from "@repo/shared";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { logger } from "../../../../logger";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({

  registerUser: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/register"), tags: TAGS } })
    .input(registerSchema)
    .output(userResponseSchema)
    .mutation(async ({ input }) => {
      return userService.registerUser(input);
    }),


    loginUser: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/login"), tags: TAGS } })
    .input(logInSchema)
    .output(loginResponseSchema)
    .mutation(async ({ input, ctx }) => {

      const loginResult = await userService.loginUser(input);

    ctx.res.cookie(
      "accessToken",
      loginResult.accessToken,
      {
         httpOnly:true,
         secure: false,
         sameSite:"lax",
         maxAge:7*24*60*60*1000
        }
      );

      return loginResult;
    }),


    getMe: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/me"), tags: TAGS } })
    .input(zodUndefinedModel)
    .output(userResponseSchema.nullable())
    .query(async ({ ctx }) => {
      logger.info("ctx-user:", ctx.user)

      if (!ctx.user) {
        return null;
      }
      logger.info("ctx-user & id:", ctx.user, ctx.user['id'])
      const user = await userService.getUserById(ctx.user.id);
      if (!user) {
        return null;
      }
      logger.info("user:", user)

      return { id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified
      };
    }),

    getUserByEmail: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/user-by-email"), tags: TAGS } })
    .input(z.object({email: z.email() }))
    .output(userResponseSchema.nullable())
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        return null;
      }
      const user = await userService.getUserByEmail(input.email);
      if (!user) {
        return null;
      }
      return { id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified
      };
    }),


    // -----------
  getSupportedAuthenticationProviders: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/supported-providers"), tags: TAGS } })
    .input(zodUndefinedModel)
    .output(z.readonly(z.array(getAuthenticationMethodOutputSchema)))
    .query(async () => {
      const supportedMethods = await userService.getAuthenticationMethods();
      return supportedMethods;
    }),
});
