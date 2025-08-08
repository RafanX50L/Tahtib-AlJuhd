import { AddedRequest } from "@/middleware/verify.token.middleware";
import { NextFunction, Request, Response } from "express";

export interface IClientWeeklyChallengeController{
    /** Reserved for Weekly Challenge specific methods */
    _placeholder?: never;

    getWeeklyChallenges(req: Request, res: Response, next: NextFunction):Promise<void>;
    getWeeklyChallengeById(req:AddedRequest, res: Response, next: NextFunction):Promise<void>;
    joinWeeklyChallenge(req: AddedRequest, res: Response, next: NextFunction):Promise<void>;
    markChallengeDayComplete(req: AddedRequest, res: Response, next: NextFunction):Promise<void>;
}