import { userData } from "@/middleware/verify.token.middleware";
import { NextFunction, Response } from "express";

export interface ITrainerController {
  getPendingApplicationDetails(
    req: userData,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  submitApplication(req: userData, res: Response, next: NextFunction): Promise<void>;
  getProfileData(req:userData, res:Response, next:NextFunction):Promise<void>;
  updateProfilePicture(req: userData, res: Response, next: NextFunction): Promise<void>;
  updateProfileData(req:userData, res:Response, next:NextFunction): Promise<void>;
}