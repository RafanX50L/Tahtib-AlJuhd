import {  Response, NextFunction } from 'express';
import { ITrainerClientService } from '@/core/interface/services/trainer/ITrainer.Clients.Service';
import { IChatService } from '@/core/interface/services/shared/IChat.Service';
import { AddedRequest } from '@/middleware/verify.token.middleware';
import { ITrainerClientsController } from '@/core/interface/controllers/trainer/ITrainer.clients.controller';
import { HttpStatus } from '@/constants/status.constant';


export class TrainerClientsController implements ITrainerClientsController {

  constructor(
    private readonly _trainerClientService: ITrainerClientService,
    private readonly _chatService: IChatService,
  ) {}

  async getClients (req: AddedRequest, res: Response, next: NextFunction): Promise<void>  {
    try {
      if (!req.user?.id || req.user.role !== 'trainer') {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Unauthorized' });
      }
      const trainerId = req.query.trainerId as string;
      if (trainerId !== req.user.id) {
        res.status(HttpStatus.FORBIDDEN).json({ error: 'Forbidden: Cannot access other trainers' });
      }
      const clients = await this._trainerClientService.getClients(trainerId);
      res.status(HttpStatus.OK).json({ data: clients });
    } catch (error) {
      next(error);
    }
  };

  async getChatMessages (req: AddedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id || req.user.role !== 'trainer') {
        res.status(401).json({ error: 'Unauthorized' });
      }
      const { chatId } = req.params;
      const messages = await this._chatService.getChatById(chatId);
      res.status(200).json({ data: messages });
    } catch (error) {
      next(error);
    }
  };
}
