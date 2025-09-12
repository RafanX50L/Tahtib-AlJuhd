import { ChatBotController } from '@/Controller/client/client.hatBot.controller';
import { ChatBotInteractionRepository } from '@/Repository/ChatBotInteraction.repository';
import { ChatBotSessionRepository } from '@/Repository/ChatBotSession.repository';
import { ChatBotService } from '@/Services/client/client.chatBot.service';
import { Router } from 'express';

const chatBotRouter = Router();

const chatBotSessionRepo = new ChatBotSessionRepository();
const chatBotInteractionRepo = new ChatBotInteractionRepository();
const chatBotService = new ChatBotService(chatBotSessionRepo,chatBotInteractionRepo);
const chatBotController = new ChatBotController(chatBotService);

chatBotRouter
  .route('/chatBot/sessions')
  .get(chatBotController.getSessions.bind(chatBotController))
  .post(chatBotController.createSession.bind(chatBotController));

chatBotRouter
  .route('/chatBot/sessions/:sessionId')
  .delete(chatBotController.deleteSession.bind(chatBotController));

chatBotRouter
  .route('/chatBot/sessions/:sessionId/interactions')
  .get(chatBotController.getInteractions.bind(chatBotController))
  .post(chatBotController.sendMessage.bind(chatBotController));


export default chatBotRouter;