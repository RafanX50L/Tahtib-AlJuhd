import { IChatController } from '@/core/interface/controllers/shared/IChat.Controller';
import { IChatService } from '@/core/interface/services/shared/IChat.Service';
import { NextFunction, Request, Response } from 'express';
import { 
  ChatDTO,
  GetChatRequestDTO
} from '@/dtos/reverse-mapping/shared/ChatDTO';
import { ControllerErrorHandler } from '@/utils/controller-error-handler.util';

export class ChatController implements IChatController {

  constructor(
    private readonly _chatService: IChatService,
  ) {}

  async getChat (req: Request, res: Response, next: NextFunction) {
    try {
      // Validate and transform request parameters using DTO
      const validatedParams: GetChatRequestDTO = ChatDTO.validateGetChatRequest(req.params);
      
      const chat = await this._chatService.getChatById(validatedParams.chatId);
      
      if (!chat) {
        ControllerErrorHandler.handleNotFound(res, "Chat not found");
        return;
      }
      
      ControllerErrorHandler.handleSuccess(res, chat, "Chat retrieved successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  };
}