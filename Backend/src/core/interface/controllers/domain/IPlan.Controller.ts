import { NextFunction, Request, Response } from "express";

export interface IPlanController {
    createPlan(req: Request, res: Response, next: NextFunction):Promise<void>;
    getPlansByTrainer(req: Request, res: Response, next: NextFunction):Promise<void>;
    updatePlan(req: Request, res: Response, next: NextFunction):Promise<void>;
    deactivatePlan(req: Request, res: Response, next: NextFunction):Promise<void>;
}