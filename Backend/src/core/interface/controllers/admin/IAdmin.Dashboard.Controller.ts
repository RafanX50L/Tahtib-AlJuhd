import { NextFunction, Request, Response } from "express";

export interface IAdminDashboardController {
  getStats(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRevenueTrends(req: Request, res: Response, next: NextFunction): Promise<void>;
  getTopTrainers(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRecentPayments(req: Request, res: Response, next: NextFunction): Promise<void>;
}