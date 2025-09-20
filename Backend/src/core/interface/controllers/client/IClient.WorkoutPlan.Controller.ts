import { AddedRequest } from "@/middleware/verify.token.middleware";
import { NextFunction, Response } from "express";


export interface IClientWorkoutPlanController {
  /** Reserved for Workout plan specific methods */
  _placeholder?: never;

  getWorkouts(req:AddedRequest, res:Response, next:NextFunction):Promise<void>;
  completeDailyWorkoutAndFetchReport(req:AddedRequest, res:Response, next:NextFunction):Promise<void>;
  getWorkoutReport(req:AddedRequest, res:Response, next:NextFunction):Promise<void>;

}
