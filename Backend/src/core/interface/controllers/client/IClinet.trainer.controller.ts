import { AddedRequest } from "@/middleware/verify.token.middleware";
import { NextFunction, Request, Response } from "express";

export interface IClientTrainerController{
    placeholder?:never;
    getAvailableTrainers(req: Request, res: Response, next: NextFunction):Promise<void>
    getTrainerById(req: Request, res: Response, next: NextFunction): Promise<void>
    getCurrentTrainer(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
    getCurrentTrainerContract(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
};