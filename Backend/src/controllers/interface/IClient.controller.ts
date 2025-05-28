import { userData } from "@/middleware/verify.token.middleware";
import { NextFunction, Request, Response } from "express";

export interface IClientController {
    generateFitnessPlan(req:Request, res:Response, next:NextFunction):Promise<void>;
    getBasicFitnessPlan(req: userData, res: Response, next: NextFunction): Promise<void>;
    getWorkouts(req: userData, res: Response, next: NextFunction): Promise<void>;
    getWeekCompletionStatus(req: userData, res: Response, next: NextFunction): Promise<void>;
}