import { db } from "@repo/database";
import { SelectUser, usersTable } from "@repo/database/schema";
import { env } from "../env";
import { googleOAuth2Client } from "../clients/google-oauth";
import { GetAuthenticationMethodOutputSchema, LogInInputType, LoginResponseType, RegisterInputType, UserResponseType } from "./model";
import { eq, sql } from "drizzle-orm";
import { InternalServerError, InvalidCredentialsError, UserAlreadyExistsError } from "../../trpc/server/utils/errors";
import bcrypt from "bcryptjs";
import * as JWT from "jsonwebtoken"
import { logger } from "@repo/logger";

class UserService {


      public async getUserByEmail(email: string) {
        const result = await db.select().from(usersTable).where(eq(usersTable.email, email));
        if (!result || result.length === 0) return null;
        return result[0];
    }

     public async getUserById(id: string) {
        const result = await db.select().from(usersTable).where(eq(usersTable.id, id));
        if (!result || result.length === 0) return null;
        return result[0];
    }

    public async verifyJWTToken(token: string) :Promise<any | null>{
      try {
        const payload = JWT.verify(token, env.JWT_SECRET) ;
        return payload;
      } catch (error) {
        return null;
      }
    }
    

  public async registerUser(registerInput: RegisterInputType): Promise<UserResponseType>{

    const normalizedEmail  = registerInput.email.toLowerCase();

    const result = await db.execute(sql`select 1`);
    console.log(result);

      const existingUser = await this.getUserByEmail(normalizedEmail);

    if (existingUser) {
      throw new UserAlreadyExistsError("User with this email already exists");
    }

     const saltRounds = 10;
     const hashedPassword = await bcrypt.hash(registerInput.password, saltRounds);

     logger.info(`Registering user with email: ${normalizedEmail}`);
    const [createdUser] = await db.insert(usersTable).values({
      name: registerInput.name,
      email: normalizedEmail,
      passwordHash: hashedPassword,
    }).returning();

    if (!createdUser) {
      throw new InternalServerError("Failed to create user");
    }

    return { id: createdUser.id, name: createdUser.name, email: createdUser.email, emailVerified: true };
  }


  public async loginUser(loginInput: LogInInputType): Promise<LoginResponseType> {

      const user = await this.getUserByEmail(loginInput.email.toLowerCase());

      const dummyHash = "$2a$10$CwTycUXWue0Thq9StjUM0uJ8z5rZ3i.1QyY9Vn0b.1YfRvH7jO"; 

       const passwordToCheck = user?.passwordHash ?? dummyHash;
  
       // always run password comparison to mitigate timing attacks, even if user doesn't exist
      const isValid = await bcrypt.compare(loginInput.password, passwordToCheck);
      
      if (!user || !isValid) {
        throw new InvalidCredentialsError();
      }

      if (!user.emailVerified) {
        throw new InvalidCredentialsError("Email not verified. Please verify your email before logging in.");
      }


        const refreshToken = JWT.sign(
            { id: user.id }, env.JWT_SECRET, { expiresIn: '7d' }
        )
        const accessToken = JWT.sign(
            { id: user.id }, env.JWT_SECRET, { expiresIn: '1h' }
        )

        if (!refreshToken || !accessToken) {
          throw new InternalServerError("Failed to generate authentication token");
        }

        const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

        await db.update(usersTable).set({ refreshTokenHash: refreshTokenHash }).where(eq(usersTable.id, user.id));

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        refreshToken: refreshToken,
        accessToken: accessToken
      };

  }   


  public async getAuthenticationMethods(): Promise<
    ReadonlyArray<GetAuthenticationMethodOutputSchema>
  > {
    const supportedAuthenticationProviders: GetAuthenticationMethodOutputSchema[] = [];

    const isGoogleConfigured = !!(env.GOOGLE_OAUTH_CLIENT_ID && env.GOOGLE_OAUTH_CLIENT_SECRET);

    if (isGoogleConfigured) {
      const url = googleOAuth2Client.generateAuthUrl();
      supportedAuthenticationProviders.push({
        provider: "GOOGLE_OAUTH",
        displayName: "Google",
        displayText: "Signin with Google",
        authUrl: url,
      });
    }

    return supportedAuthenticationProviders;
  }




}

export default UserService;
