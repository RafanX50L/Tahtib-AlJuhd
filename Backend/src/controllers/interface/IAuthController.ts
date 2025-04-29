import { Request, Response, NextFunction } from "express";

export interface IAuthController {
    signUp(req: Request, res: Response, next: NextFunction): Promise<void>;
}