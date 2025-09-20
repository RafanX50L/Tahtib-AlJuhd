import { IAdminDashboardController } from "@/core/interface/controllers/admin/IAdmin.Dashboard.Controller";
import { IAdminDashboardService } from "@/core/interface/services/admin/IAdmin.Dashboard.Service";
import { NextFunction, Request, Response } from "express";
import { 
  AdminDashboardDTO,
  GetRevenueTrendsRequestDTO,
  GetTopTrainersRequestDTO,
  GetRecentPaymentsRequestDTO
} from "@/dtos/reverse-mapping/admin/DashboardDTO";
import { ControllerErrorHandler } from "@/utils/controller-error-handler.util";

export class AdminDashboardController implements IAdminDashboardController {
  constructor(private readonly _service: IAdminDashboardService) {}

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await this._service.getStats();
      ControllerErrorHandler.handleSuccess(res, stats, "Dashboard stats retrieved successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getRevenueTrends(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate and transform request parameters using DTO
      const validatedParams: GetRevenueTrendsRequestDTO = AdminDashboardDTO.validateGetRevenueTrendsRequest(req.query);
      
      // Call service with validated parameters - service already returns DTOs
      const result = await this._service.getRevenueTrends(validatedParams.monthsBack);

      ControllerErrorHandler.handleSuccess(res, result, "Revenue trends retrieved successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getTopTrainers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate and transform request parameters using DTO
      const validatedParams: GetTopTrainersRequestDTO = AdminDashboardDTO.validateGetTopTrainersRequest(req.query);
      
      // Call service with validated parameters - service already returns DTOs
      const result = await this._service.getTopTrainers(validatedParams.limit);

      ControllerErrorHandler.handleSuccess(res, result, "Top trainers retrieved successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getRecentPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate and transform request parameters using DTO
      const validatedParams: GetRecentPaymentsRequestDTO = AdminDashboardDTO.validateGetRecentPaymentsRequest(req.query);
      
      // Call service with validated parameters - service already returns DTOs
      const result = await this._service.getRecentPayments(
        validatedParams.page || 1,
        validatedParams.pageSize || 10,
        validatedParams.searchTerm || ""
      );

      ControllerErrorHandler.handleSuccess(res, result, "Recent payments retrieved successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }
}

 