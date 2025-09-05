var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import generateChatBotResponse from '../../utils/ChatBot.gemini';
import { ChatBotDTO } from '../../dtos/client/ChatBotDTO';
// If you have a separate plain interface, import it here,import { IChatBotnteraction } from '../../core/interface/model/IChatBotInteraction.model';
export class ChatBotService {
    constructor(_chatBotSessionRepo, _chatBotInteractionRepo) {
        this._chatBotSessionRepo = _chatBotSessionRepo;
        this._chatBotInteractionRepo = _chatBotInteractionRepo;
    }
    getSessions(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._chatBotSessionRepo.findByClientId(clientId);
            return yield ChatBotDTO.mapToChatSessionData(result);
        });
    }
    createSession(clientId, title) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const result = yield this._chatBotSessionRepo.create(session);
            return {
                id: result._id.toString(),
                lastInteraction: result.lastInteraction,
                createdAt: result.createdAt.toISOString(),
                title: result.title || undefined,
                messageCount: result.messageCount,
            };
        });
    }
    deleteSession(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._chatBotSessionRepo.delete(sessionId);
            return;
        });
    }
    getInteractions(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._chatBotInteractionRepo.findBySessionId(sessionId);
            return yield ChatBotDTO.mapToChatBotInteractionData(result);
        });
    }
    sendMessage(sessionId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const userInteraction = {
                sessionId,
                content: message,
                isUser: true,
                createdAt: now,
            };
            const history = yield this._chatBotInteractionRepo.findBySessionId(sessionId);
            const botResponse = yield generateChatBotResponse(history, message);
            const botInteraction = {
                sessionId,
                content: botResponse,
                isUser: false,
                createdAt: new Date(now.getTime() + 1000),
            };
            yield this._chatBotInteractionRepo.create(userInteraction);
            yield this._chatBotInteractionRepo.create(botInteraction);
            yield this._chatBotSessionRepo.update(sessionId, {
                lastInteraction: message,
                messageCount: (yield this.getMessageCount(sessionId)) + 2,
            });
            return ChatBotDTO.mapToChatBotInteractionData([userInteraction, botInteraction]);
        });
    }
    getMessageCount(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const interactions = yield this._chatBotInteractionRepo.findBySessionId(sessionId);
            return interactions.length;
        });
    }
}
//# sourceMappingURL=ChatBot.service.js.map