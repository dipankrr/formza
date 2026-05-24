import { db } from "@repo/database";
import { formsTable, usersTable } from "@repo/database/schema";
import { env } from "../env";
import { createFormSchema, formResponseSchema, UpdateFormInputType, type CreateFormInputType} from "@repo/shared";
import { eq, sql } from "drizzle-orm";
import { InternalServerError, UserNotFoundError, ForbiddenError } from "../../trpc/server/utils/errors";
import bcrypt from "bcryptjs";
import * as JWT from "jsonwebtoken"
import { logger } from "@repo/logger";

class FormService {

    //-------------------// utils //-------------------------//

     public async getUserById(id: string) {
            const result = await db.select().from(usersTable).where(eq(usersTable.id, id));
            if (!result || result.length === 0) return null;
            return result[0];
        }


    //-------------------// services //-------------------------//

    public async createForm(createFormIput: CreateFormInputType, creatorId: string){
        const [result] = await db.insert(formsTable).values(
            {
                ...createFormIput,
                creatorId,
            }
        ).returning();

        if (!result || !result.id) {
            throw new InternalServerError("Could not create form")
        }

        return result;
    }


    //not complete
    public async updateForm(updateFormIput: UpdateFormInputType, creatorId: string){
        const result = await db.update(formsTable).set({
            ...updateFormIput
        }).returning();

        if (!result) {
            throw new InternalServerError("Could not create form")
        }

        return result;
    }

    
    public async getAllFormsOfUser(userId: string){

        const user = await this.getUserById(userId)
        if (!user) throw new UserNotFoundError("User does not exists");

        const result = await db.select().from(formsTable).where(eq(formsTable.creatorId, userId));
        
        return result;
    }
}

export default FormService;