import { userData } from "@/middleware/verify.token.middleware";
import { NextFunction, Response } from "express";

export interface ITrainerController {
  submitApplication(req: userData, res: Response, next: NextFunction): Promise<void>;
}