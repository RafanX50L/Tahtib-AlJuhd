import { NextFunction,  Response } from "express";
import { IDashboardController } from "@/core/interface/controllers/client/IDashboard.Controller";
import { IDashboardService } from "@/core/interface/services/client/IDashboard.Service";
import { createHttpError } from "@/utils";
import { HttpStatus } from "@/constants/status.constant";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { 
  ClientDashboardDTO,
  GetClientDashboardStatsRequestDTO
} from '@/dtos/reverse-mapping/client/ClientDashboardDTO';
import { ControllerErrorHandler } from '@/utils/controller-error-handler.util';

export class DashboardController implements IDashboardController {
  constructor(
    private readonly _dashboardService: IDashboardService
  ) {}

  async getClientDashboardStats(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate and transform request parameters using DTO
      const validatedParams: GetClientDashboardStatsRequestDTO = ClientDashboardDTO.validateGetClientDashboardStatsRequest(req.params);
      
      const clientId = validatedParams.clientId || req.user?.id;
      
      if (!clientId) {
        throw createHttpError(HttpStatus.BAD_REQUEST, "Client ID is required");
      }

      const stats = await this._dashboardService.getClientDashboardStats(clientId);
      
      ControllerErrorHandler.handleSuccess(res, stats, "Dashboard statistics retrieved successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }
}
