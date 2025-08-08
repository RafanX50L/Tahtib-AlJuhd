import { AddedRequest } from "@/middleware/verify.token.middleware";
import { NextFunction, Response } from "express";

export interface IClientDietPlanController {
    getDietPlan(req:AddedRequest, res:Response, next:NextFunction):Promise<void>;
}