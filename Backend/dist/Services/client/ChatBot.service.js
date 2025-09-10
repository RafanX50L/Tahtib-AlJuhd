"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatBotService = void 0;
const ChatBot_gemini_1 = __importDefault(require("../../utils/ChatBot.gemini"));
const ChatBotDTO_1 = require("../../dtos/client/ChatBotDTO");
// If you have a separate plain interface, import it here,import { IChatBotnteraction } from '../../core/interface/model/IChatBotInteraction.model';
class ChatBotService {
    _chatBotSessionRepo;
    _chatBotInteractionRepo;
    constructor(_chatBotSessionRepo, _chatBotInteractionRepo) {
        this._chatBotSessionRepo = _chatBotSessionRepo;
        this._chatBotInteractionRepo = _chatBotInteractionRepo;
    }
    async getSessions(clientId) {
        const result = await this._chatBotSessionRepo.findByClientId(clientId);
        return await ChatBotDTO_1.ChatBotDTO.mapToChatSessionData(result);
    }
    async createSession(clientId, title) {
        // const sessionId = uuidv4();
        const createdAt = new Date();
        const session = {
            // _id: sessionId,
            clientId,
            title,
            lastInteraction: 'Start a new conversation...',
            createdAt,
            messageCount: 0,
        };
        const result = await this._chatBotSessionRepo.create(session);
        return {
            id: result._id.toString(),
            lastInteraction: result.lastInteraction,
            createdAt: result.createdAt.toISOString(),
            title: result.title || undefined,
            messageCount: result.messageCount,
        };
    }
    async deleteSession(sessionId) {
        await this._chatBotSessionRepo.delete(sessionId);
        return;
    }
    async getInteractions(sessionId) {
        const result = await this._chatBotInteractionRepo.findBySessionId(sessionId);
        return await ChatBotDTO_1.ChatBotDTO.mapToChatBotInteractionData(result);
    }
    async sendMessage(sessionId, message) {
        const now = new Date();
        const userInteraction = {
            sessionId,
            content: message,
            isUser: true,
            createdAt: now,
        };
        const history = await this._chatBotInteractionRepo.findBySessionId(sessionId);
        const botResponse = await (0, ChatBot_gemini_1.default)(history, message);
        const botInteraction = {
            sessionId,
            content: botResponse,
            isUser: false,
            createdAt: new Date(now.getTime() + 1000),
        };
        await this._chatBotInteractionRepo.create(userInteraction);
        await this._chatBotInteractionRepo.create(botInteraction);
        await this._chatBotSessionRepo.update(sessionId, {
            lastInteraction: message,
            messageCount: await this.getMessageCount(sessionId) + 2,
        });
        return ChatBotDTO_1.ChatBotDTO.mapToChatBotInteractionData([userInteraction, botInteraction]);
    }
    async getMessageCount(sessionId) {
        const interactions = await this._chatBotInteractionRepo.findBySessionId(sessionId);
        return interactions.length;
    }
}
exports.ChatBotService = ChatBotService;
//# sourceMappingURL=ChatBot.service.js.map