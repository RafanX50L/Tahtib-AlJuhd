import { Request, Response } from "express";

export interface ITrainerDashboardController {
  getStats(req: Request, res: Response): Promise<void>;
  getTrends(req: Request, res: Response): Promise<void>;
  getPayments(req: Request, res: Response): Promise<void>;
}


