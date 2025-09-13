import { HttpStatus } from "@/constants/status.constant";
import { IAdminDashboardController } from "@/core/interface/controllers/admin/IAdmin.Dashboard.Controller";
import { IAdminDashboardService } from "@/core/interface/services/admin/IAdmin.Dashboard.Service";
import { NextFunction, Request, Response } from "express";

export class AdminDashboardController implements IAdminDashboardController {
  constructor(private readonly _service: IAdminDashboardService) {}

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await this._service.getStats();
      res.status(HttpStatus.OK).json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }

  async getRevenueTrends(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const monthsBack = req.query.monthsBack ? parseInt(req.query.monthsBack as string) : 6;
      const result = await this._service.getRevenueTrends(monthsBack);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getTopTrainers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const result = await this._service.getTopTrainers(limit);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getRecentPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;
      const searchTerm = req.query.searchTerm ? (req.query.searchTerm as string) : "";
      const result = await this._service.getRecentPayments(page, pageSize, searchTerm);
      res.status(HttpStatus.OK).json({ success: true, data: result.data, total: result.total });
    } catch (error) {
      next(error);
    }
  }
}

 