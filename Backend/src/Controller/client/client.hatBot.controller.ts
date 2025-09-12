import { NextFunction, Request, Response } from 'express';
import { IChatBotService } from '@/core/interface/services/client/Iclient.ChatBot.service';
import { AddedRequest } from '@/middleware/verify.token.middleware';
import { IChatBotController } from '@/core/interface/controllers/client/IChatBot.controller';
import { HttpStatus } from '@/constants/status.constant';
import { HttpResponse } from '@/constants/response-message.constant';

export class ChatBotController implements IChatBotController{

  constructor(
    private readonly _chatBotService: IChatBotService
  ) {}

  async getSessions(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const clientId = req.user?.id;
      const sessions = await this._chatBotService.getSessions(clientId);
      res.status(HttpStatus.OK).json({message:HttpResponse.DATA_FETCHING_SUCCESSFULL,sessions});
    } catch (error) {
      next(error);
    }
  }

  async createSession(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const clientId = req.user?.id;
      const { title } = req.body;
      const session = await this._chatBotService.createSession(clientId, title);
      console.log('session',session);
      res.status(HttpStatus.CREATED).json({message:HttpResponse.CREATING_CHAT_BOT_SESSION_SUCCESSFULL,session});
    } catch (error) {
      next(error);
    }
  }

  async deleteSession(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = req.params.sessionId;
      await this._chatBotService.deleteSession(sessionId);
      res.status(HttpStatus.OK).send({message:HttpResponse.CHAT_BOT_SESSION_DELETION_SUCCESSFULL});
    } catch (error) {
      next(error);
    }
  }

  async getInteractions(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = req.params.sessionId;
      const interactions = await this._chatBotService.getInteractions(sessionId);
      res.status(HttpStatus.OK).json({message:HttpResponse.DATA_FETCHING_SUCCESSFULL,interactions});
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = req.params.sessionId;
      const { message } = req.body;
      const interactions = await this._chatBotService.sendMessage(sessionId, message);
      res.status(HttpStatus.CREATED).json(interactions);
    } catch (error) {
      next(error);
    }
  }
}