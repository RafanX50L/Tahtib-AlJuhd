import { NextFunction, Request, Response } from "express";

export interface IChatController {
    getChat (req: Request, res: Response, next: NextFunction):Promise<void>;
}