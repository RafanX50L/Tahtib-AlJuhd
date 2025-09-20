import { ChatController } from '@/Controller/shared/chat.controller';
import { AddedRequest } from '@/middleware/verify.token.middleware';
import { ChatRepository } from '@/Repository/Chat.repository';
import { ChatService } from '@/Services/shared/chat.service';
import express, { NextFunction, Response } from 'express';
import { Types } from 'mongoose';

const router = express.Router();

const chatRepo = new ChatRepository();
const chatService = new ChatService(chatRepo);
const chatController = new ChatController(chatService);

const restrictToChatParticipant = async (req: AddedRequest, res: Response, next: NextFunction) => {
  const { chatId } = req.params;

  if (!Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({ error: 'Invalid chat ID format' });
  }

  const chat = await chatRepo.findById(new Types.ObjectId(chatId));

  if (!chat || !req.user || !chat.participants.some(p => p.toString() === req.user!.id.toString())) {
    return res.status(403).json({ error: 'Access denied to chat' });
  }

  next();
};

router.get('/:chatId', restrictToChatParticipant, chatController.getChat.bind(chatController));
export default router;