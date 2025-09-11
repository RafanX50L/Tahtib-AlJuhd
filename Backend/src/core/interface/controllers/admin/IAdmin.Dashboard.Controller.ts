import { Request, Response } from "express";

export interface IAdminDashboardController {
  getStats(req: Request, res: Response): Promise<void>;
  getRevenueTrends(req: Request, res: Response): Promise<void>;
  getTopTrainers(req: Request, res: Response): Promise<void>;
}


