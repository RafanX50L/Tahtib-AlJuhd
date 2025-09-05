var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ChatController } from '../../Controller/shared/Chat.controller';
import { ChatRepository } from '../../Repository/Chat.repository';
import { ChatService } from '../../Services/shared/Chat.service';
import express from 'express';
import { Types } from 'mongoose';
const router = express.Router();
const chatRepo = new ChatRepository();
const chatService = new ChatService(chatRepo);
const chatController = new ChatController(chatService);
// Middleware to ensure user is a participant in the chat
const restrictToChatParticipant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    if (!Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ error: 'Invalid chat ID format' });
    }
    const chat = yield chatRepo.findById(new Types.ObjectId(chatId));
    if (!chat || !req.user || !chat.participants.some(p => p.toString() === req.user.id.toString())) {
        return res.status(403).json({ error: 'Access denied to chat' });
    }
    next();
});
router.get('/:chatId', restrictToChatParticipant, chatController.getChat.bind(chatController));
export default router;
//# sourceMappingURL=chat.routes.js.map