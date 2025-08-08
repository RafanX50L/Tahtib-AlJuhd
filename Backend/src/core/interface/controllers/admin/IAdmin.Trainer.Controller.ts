import { NextFunction, Request, Response } from "express";

export interface IAdminTrainerController{
    getApprovedTrainers(req: Request, res: Response, next: NextFunction):Promise<void>;
    getPendingTrainers(req: Request, res: Response, next: NextFunction):Promise<void>;
}