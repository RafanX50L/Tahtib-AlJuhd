import { Request, Response } from "express";

export interface IDashboardController {
  getClientDashboardStats(req: Request, res: Response): Promise<void>;
}
