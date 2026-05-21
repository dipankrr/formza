import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(80, "Name cannot exceed 80 characters");

const emailSchema = z
  .email()
  .trim()
  .toLowerCase()
  .max(255);

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100)
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[0-9]/, "Must contain a number");


export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
  });

export const logInSchema = z.object({
  email: emailSchema,
  // backward compatibility
  password: z.string().min(1),
});

export const userResponseSchema =
  z.object({
    id:z.string(),
    name:nameSchema,
    email:emailSchema,
    emailVerified:z.boolean()
});

export const loginResponseSchema =
  z.object({
    id:z.string(),
    name:nameSchema,
    email:emailSchema,
    emailVerified:z.boolean(),
    refreshToken: z.string(),
    accessToken: z.string(),
});


//Google callback payload Server-side only
export const googleUserSchema = z.object({
  name: nameSchema,

  email: emailSchema,

  googleId: z.string().min(1),

  profileImageUrl: z
    .url()
    .nullable()
    .optional(),

  emailVerified: z.boolean(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const logoutSchema = z.object({
  userId: z.uuid(),
});


export type RegisterInputType = z.infer<typeof registerSchema>;

export type LogInInputType = z.infer<typeof logInSchema>;

export type UserResponseType = z.infer<typeof userResponseSchema>;
export type LoginResponseType = z.infer<typeof loginResponseSchema>;

export type GoogleUserInputType = z.infer<typeof googleUserSchema>;

export type RefreshTokenInputType = z.infer<typeof refreshTokenSchema>;


// 

export const getAuthenticationMethodOutputSchema = z.object({
  provider: z.enum(["GOOGLE_OAUTH"]),
  displayName: z.string().optional(),
  displayText: z.string().optional(),
  authUrl: z.string(),
});
export type GetAuthenticationMethodOutputSchema = z.infer<
  typeof getAuthenticationMethodOutputSchema
>;


