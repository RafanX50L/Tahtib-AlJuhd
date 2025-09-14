import { NextFunction, Request, Response } from 'express';
import { IChatBotService } from '@/core/interface/services/client/Iclient.ChatBot.service';
import { AddedRequest } from '@/middleware/verify.token.middleware';
import { IChatBotController } from '@/core/interface/controllers/client/IChatBot.controller';
import { HttpStatus } from '@/constants/status.constant';
import { HttpResponse } from '@/constants/response-message.constant';
import { 
  ClientChatBotDTO,
  CreateSessionRequestDTO,
  DeleteSessionRequestDTO,
  GetInteractionsRequestDTO,
  SendMessageRequestDTO
} from '@/dtos/reverse-mapping/client/ClientChatBotDTO';
import { ControllerErrorHandler } from '@/utils/controller-error-handler.util';

export class ChatBotController implements IChatBotController{

  constructor(
    private readonly _chatBotService: IChatBotService
  ) {}

  async getSessions(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const clientId = req.user?.id;
      const sessions = await this._chatBotService.getSessions(clientId);
      
      ControllerErrorHandler.handleSuccess(res, { sessions }, HttpResponse.DATA_FETCHING_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async createSession(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      // Validate and transform request body using DTO
      const validatedBody: CreateSessionRequestDTO = ClientChatBotDTO.validateCreateSessionRequest(req.body);
      
      const clientId = req.user?.id;
      const session = await this._chatBotService.createSession(clientId, validatedBody.title);
      
      ControllerErrorHandler.handleSuccess(res, { session }, HttpResponse.CREATING_CHAT_BOT_SESSION_SUCCESSFULL, HttpStatus.CREATED);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async deleteSession(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate and transform request parameters using DTO
      const validatedParams: DeleteSessionRequestDTO = ClientChatBotDTO.validateDeleteSessionRequest(req.params);
      
      await this._chatBotService.deleteSession(validatedParams.sessionId);
      
      ControllerErrorHandler.handleSuccess(res, null, HttpResponse.CHAT_BOT_SESSION_DELETION_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getInteractions(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate and transform request parameters using DTO
      const validatedParams: GetInteractionsRequestDTO = ClientChatBotDTO.validateGetInteractionsRequest(req.params);
      
      const interactions = await this._chatBotService.getInteractions(validatedParams.sessionId);
      
      ControllerErrorHandler.handleSuccess(res, { interactions }, HttpResponse.DATA_FETCHING_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate and transform request parameters and body using DTOs
      const sessionId = req.params.sessionId;
      const validatedBody: SendMessageRequestDTO = ClientChatBotDTO.validateSendMessageRequest(req.body);
      
      const interactions = await this._chatBotService.sendMessage(sessionId, validatedBody.message);
      
      ControllerErrorHandler.handleSuccess(res, interactions, "Message sent successfully", HttpStatus.CREATED);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }
}