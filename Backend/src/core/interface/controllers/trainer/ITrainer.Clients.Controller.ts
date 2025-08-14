import { AddedRequest } from "@/middleware/verify.token.middleware";
import { NextFunction, Response } from "express";

export interface ITrainerClientsController{
    getClients(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
    getChatMessages(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
}