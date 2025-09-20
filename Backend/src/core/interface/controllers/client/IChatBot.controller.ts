import { AddedRequest } from "@/middleware/verify.token.middleware";
import { NextFunction, Request, Response } from "express";

export interface IChatBotController {
    getSessions(req: AddedRequest, res: Response, next: NextFunction):Promise<void>;
    createSession(req: AddedRequest, res: Response, next: NextFunction):Promise<void>;
    deleteSession(req: Request, res: Response, next: NextFunction):Promise<void>;
    getInteractions(req: Request, res: Response, next: NextFunction):Promise<void>;
    sendMessage(req: Request, res: Response, next: NextFunction):Promise<void>;
}