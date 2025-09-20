import { NextFunction, Request, Response } from "express";

export interface IDashboardController {
  getClientDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void>;
}
