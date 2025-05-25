import { NextFunction, Request, Response } from "express";

export interface IClientController {
    generateFitnessPlan(req:Request, res:Response, next:NextFunction):Promise<void>;
}