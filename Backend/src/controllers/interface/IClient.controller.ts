import { userData } from "@/middleware/verify.token.middleware";
import { NextFunction, Request, Response } from "express";

export interface IClientController {
    generateFitnessPlan(req:Request, res:Response, next:NextFunction):Promise<void>;
    getBasicFitnessPlan(req: userData, res: Response, next: NextFunction): Promise<void>;
    getWorkouts(req: userData, res: Response, next: NextFunction): Promise<void>;
    getWeekCompletionStatus(req: userData, res: Response, next: NextFunction): Promise<void>;
    updateDayCompletionStatus(req: userData, res: Response, next: NextFunction): Promise<void>;
    getWorkoutReport(req: userData, res: Response, next: NextFunction): Promise<void>;
    getWeeklyChallenges(req: Request, res: Response, next: NextFunction): Promise<void>;
    getChallengeById(req: userData, res: Response, next: NextFunction): Promise<void>;
    joinWeeklyChallenge(req: userData, res: Response, next: NextFunction): Promise<void>;
}