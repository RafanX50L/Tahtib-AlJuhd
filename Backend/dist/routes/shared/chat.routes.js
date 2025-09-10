"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Chat_controller_1 = require("../../Controller/shared/Chat.controller");
const Chat_repository_1 = require("../../Repository/Chat.repository");
const Chat_service_1 = require("../../Services/shared/Chat.service");
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const router = express_1.default.Router();
const chatRepo = new Chat_repository_1.ChatRepository();
const chatService = new Chat_service_1.ChatService(chatRepo);
const chatController = new Chat_controller_1.ChatController(chatService);
// Middleware to ensure user is a participant in the chat
const restrictToChatParticipant = async (req, res, next) => {
    const { chatId } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ error: 'Invalid chat ID format' });
    }
    const chat = await chatRepo.findById(new mongoose_1.Types.ObjectId(chatId));
    if (!chat || !req.user || !chat.participants.some(p => p.toString() === req.user.id.toString())) {
        return res.status(403).json({ error: 'Access denied to chat' });
    }
    next();
};
router.get('/:chatId', restrictToChatParticipant, chatController.getChat.bind(chatController));
exports.default = router;
//# sourceMappingURL=chat.routes.js.map