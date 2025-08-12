import { NextFunction, Request, Response } from "express";

export interface IClientTrainerController{
    placeholder?:never;
    getAvailableTrainers(req: Request, res: Response, next: NextFunction):Promise<void>
};