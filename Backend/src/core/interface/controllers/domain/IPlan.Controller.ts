import { NextFunction, Request, Response } from "express";

export interface IPlanController {
    createPlan(req: Request, res: Response, next: NextFunction):Promise<void>;
    getPlansByTrainer(req: Request, res: Response, next: NextFunction):Promise<void>;
}