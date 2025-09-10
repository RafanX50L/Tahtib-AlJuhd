"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatBotSessionRepository = void 0;
const base_repository_1 = require("./base.repository");
const chatBotSession_model_1 = require("../models/chatBotSession.model");
class ChatBotSessionRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(chatBotSession_model_1.ChatBotSessionModel);
    }
    async findByClientId(clientId) {
        return await this.model.find({ clientId })
            .sort({ createdAt: -1 })
            .exec();
    }
    // async create(session: ChatSession): Promise<ChatSession> {
    //   const newSession = new this.model(session);
    //   return await newSession.save();
    // }
    async delete(sessionId) {
        await this.model.deleteOne({ _id: sessionId }).exec();
    }
}
exports.ChatBotSessionRepository = ChatBotSessionRepository;
//# sourceMappingURL=ChatBotSession.repository.js.map