import { NextFunction,  Response } from "express";
import { IDashboardController } from "@/core/interface/controllers/client/IDashboard.Controller";
import { IDashboardService } from "@/core/interface/services/client/IDashboard.Service";
import { createHttpError } from "@/utils";
import { HttpStatus } from "@/constants/status.constant";
import { AddedRequest } from "@/middleware/verify.token.middleware";

export class DashboardController implements IDashboardController {
  constructor(
    private readonly _dashboardService: IDashboardService
  ) {}

  async getClientDashboardStats(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const clientId = req.params.clientId || req.user?.id;
      
      if (!clientId) {
        throw createHttpError(HttpStatus.BAD_REQUEST, "Client ID is required");
      }

      const stats = await this._dashboardService.getClientDashboardStats(clientId);
      
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Dashboard statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      next(error);
      throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve dashboard statistics");
    }
  }
}
