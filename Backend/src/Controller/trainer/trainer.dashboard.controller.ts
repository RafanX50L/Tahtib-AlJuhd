
import { ITrainerDashboardController } from "@/core/interface/controllers/trainer/ITrainer.Dashboard.Controller";
import { ITrainerDashboardService } from "@/core/interface/services/trainer/ITrainer.Dashboard.Service";
import { HttpStatus } from "@/constants/status.constant";
import { Response } from "express";
import { AddedRequest } from "@/middleware/verify.token.middleware";

export class TrainerDashboardController implements ITrainerDashboardController {
  constructor(private readonly _service: ITrainerDashboardService) {}

  async getStats(req: AddedRequest, res: Response): Promise<void> {
    const trainerId = req.user?.id as string;
    const stats = await this._service.getStats(trainerId);
    res.status(HttpStatus.OK).json({ success: true, data: stats });
  }

  async getTrends(req: AddedRequest, res: Response): Promise<void> {
    const trainerId = req.user?.id as string;
    const trends = await this._service.getTrends(trainerId);
    res.status(HttpStatus.OK).json({ success: true, data: trends });
  }

  async getPayments(req: AddedRequest, res: Response): Promise<void> {
    const trainerId = req.user?.id as string;
    const { page, limit, status = 'all', search } = req.query as | { page?: string; limit?: string; status?: 'pending' | 'completed' | 'failed' | 'refunded' | 'all'; search?: string };
    const result = await this._service.getPayments(trainerId, {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      status,
      search,
    });
    res.status(HttpStatus.OK).json({ success: true, data: result });
  }
}

 