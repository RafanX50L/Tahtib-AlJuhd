import { HttpStatus } from '@/constants/status.constant';
import { IChatService } from '@/core/interface/services/shared/IChat.Service';
import { NextFunction, Request, Response } from 'express';

export class ChatController {

  constructor(
    private readonly _chatService: IChatService,
  ) {}

  async getChat (req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const chat = await this._chatService.getChatById(chatId);
      if (!chat) throw new Error('Chat not found');
      res.status(HttpStatus.OK).json(chat);
    } catch (err) {
      next(err);
    }
  };
}