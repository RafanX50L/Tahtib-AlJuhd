import { AddedRequest } from "@/middleware/verify.token.middleware";
import { NextFunction, Response } from "express";

export interface ITrainerDashboardController {
  getStats(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
  getTrends(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
  getPayments(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
}


