import { HttpResponse } from '@/constants/response-message.constant';
import { HttpStatus } from '@/constants/status.constant';
import { IClientProgressController } from '@/core/interface/controllers/client/IClient.Progress.Controller';
import { IClientProgressService } from '@/core/interface/services/client/IClient.Progress.Service';
import { AddedRequest } from '@/middleware/verify.token.middleware';
import { NextFunction, Request, Response } from 'express';

export class ClientProgressController implements IClientProgressController {
  constructor(private readonly _progressService: IClientProgressService) {}

  async addEntry(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.id;
      const { date, weight, height } = req.body as { date: string; weight: number; height: number };
      await this._progressService.addEntry(userId, new Date(date), Number(weight), Number(height));
      res.status(HttpStatus.CREATED).json({ message: HttpResponse.DATA_CREATION_SUCCESSFULL });
    } catch (error) {
      next(error);
    }
  }

  async getCurrentStatus(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.id;
      const current = await this._progressService.getCurrentStatus(userId);
      res.status(HttpStatus.OK).json({ message: HttpResponse.DATA_FETCHING_SUCCESSFULL, current });
    } catch (error) {
      next(error);
    }
  }

  async getGraphData(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.id;
      const { start, end } = req.query as { start: string; end: string };
      const points = await this._progressService.getGraphData(userId, new Date(start), new Date(end));
      res.status(HttpStatus.OK).json({ message: HttpResponse.DATA_FETCHING_SUCCESSFULL, points });
    } catch (error) {
      next(error);
    }
  }

  async previewEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { date, weight, height } = req.body as { date: string; weight: number; height: number };
      const preview = await this._progressService.previewEntry(new Date(date), Number(weight), Number(height));
      res.status(HttpStatus.OK).json({ message: HttpResponse.DATA_FETCHING_SUCCESSFULL, preview, warning: 'Preview only. This will not be stored in the database.' });
    } catch (error) {
      next(error);
    }
  }
}


