
import { ITrainerDashboardController } from "@/core/interface/controllers/trainer/ITrainer.Dashboard.Controller";
import { ITrainerDashboardService } from "@/core/interface/services/trainer/ITrainer.Dashboard.Service";
import { Response, NextFunction } from "express";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { 
  TrainerDashboardDTO,
  GetPaymentsRequestDTO
} from '@/dtos/reverse-mapping/trainer/TrainerDashboardDTO';
import { ControllerErrorHandler } from '@/utils/controller-error-handler.util';

export class TrainerDashboardController implements ITrainerDashboardController {
  constructor(private readonly _service: ITrainerDashboardService) {}

  async getStats(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const trainerId = req.user?.id as string;
      const stats = await this._service.getStats(trainerId);
      
      ControllerErrorHandler.handleSuccess(res, stats, "Dashboard stats retrieved successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getTrends(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const trainerId = req.user?.id as string;
      const trends = await this._service.getTrends(trainerId);
      
      ControllerErrorHandler.handleSuccess(res, trends, "Trends retrieved successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getPayments(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const trainerId = req.user?.id as string;
      
      // Validate and transform request parameters using DTO
      const validatedParams: GetPaymentsRequestDTO = TrainerDashboardDTO.validateGetPaymentsRequest(req.query);
      
      const result = await this._service.getPayments(trainerId, {
        page: validatedParams.page,
        limit: validatedParams.limit,
        status: validatedParams.status || 'all',
        search: validatedParams.search,
      });
      
      ControllerErrorHandler.handleSuccess(res, result, "Payments retrieved successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }
}

 