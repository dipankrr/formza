import type * as trpcExpress from "@trpc/server/adapters/express";
import type { Request, Response } from "express";
import {userService} from "./services/index";


type User = {
    id: string;
} | null;

export type Context = {
    req: Request;
    res: Response;
    user: User;
};

export async function createContext({
    req,
    res,
}: trpcExpress.CreateExpressContextOptions): Promise<Context> {

    console.log(" context ");
    const token = req.cookies?.accessToken;

    let user: User = null;

    const payload = await userService.verifyJWTToken(token);

    if(payload){
        user = {
                id: payload.id,
            };
    }

    return {
        req,
        res,
        user,
    };
}