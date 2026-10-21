"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatBotInteractionRepository = void 0;
const base_repository_1 = require("./base.repository");
const ChatBotInteraction_model_1 = require("../models/ChatBotInteraction.model");
class ChatBotInteractionRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(ChatBotInteraction_model_1.ChatBotInteractionModel);
    }
    async findBySessionId(sessionId) {
        return await this.model.find({ sessionId })
            .sort({ createdAt: 1 })
            .exec();
    }
    async create(interaction) {
        const newInteraction = new this.model(interaction);
        return await newInteraction.save();
    }
}
exports.ChatBotInteractionRepository = ChatBotInteractionRepository;
//# sourceMappingURL=ChatBotInteraction.repository.js.map