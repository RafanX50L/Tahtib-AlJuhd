import {  Response, NextFunction } from 'express';
import { ITrainerClientService } from '@/core/interface/services/trainer/ITrainer.Clients.Service';
import { IChatService } from '@/core/interface/services/shared/IChat.Service';
import { AddedRequest } from '@/middleware/verify.token.middleware';
import { HttpStatus } from '@/constants/status.constant';
import { ITrainerClientsController } from '@/core/interface/controllers/trainer/ITrainer.Clients.Controller';
import { 
  TrainerClientsDTO,
  GetClientsRequestDTO,
  GetChatMessagesRequestDTO
} from '@/dtos/reverse-mapping/trainer/TrainerClientsDTO';
import { ControllerErrorHandler } from '@/utils/controller-error-handler.util';


export class TrainerClientsController implements ITrainerClientsController {

  constructor(
    private readonly _trainerClientService: ITrainerClientService,
    private readonly _chatService: IChatService,
  ) {}

  async getClients (req: AddedRequest, res: Response, next: NextFunction): Promise<void>  {
    try {
      if (!req.user?.id || req.user.role !== 'trainer') {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Unauthorized' });
        return;
      }
      
      // Validate and transform request parameters using DTO
      const validatedParams: GetClientsRequestDTO = TrainerClientsDTO.validateGetClientsRequest(req.query);
      
      if (validatedParams.trainerId !== req.user.id) {
        res.status(HttpStatus.FORBIDDEN).json({ error: 'Forbidden: Cannot access other trainers' });
        return;
      }
      
      const clients = await this._trainerClientService.getClients(validatedParams.trainerId);
      
      ControllerErrorHandler.handleSuccess(res, clients, "Clients retrieved successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  };

  async getChatMessages (req: AddedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id || req.user.role !== 'trainer') {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Unauthorized' });
        return;
      }
      
      // Validate and transform request parameters using DTO
      const validatedParams: GetChatMessagesRequestDTO = TrainerClientsDTO.validateGetChatMessagesRequest(req.params);
      
      const messages = await this._chatService.getChatById(validatedParams.chatId);
      
      ControllerErrorHandler.handleSuccess(res, messages, "Chat messages retrieved successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  };
}
