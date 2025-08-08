import { AddedRequest } from "@/middleware/verify.token.middleware";
import { NextFunction, Response } from "express";

export interface ITrainerPersonalizationController {
  _private: never;
  submitApplication(
    req: AddedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getPendingApplicationDetails(
    req: AddedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getProfileData(
    req: AddedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  updateProfileData(
    req: AddedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
