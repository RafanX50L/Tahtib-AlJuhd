"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatBotSessionModel = void 0;
const mongoose_1 = require("mongoose");
const ChatSessionSchema = new mongoose_1.Schema({
    clientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String },
    lastInteraction: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    messageCount: { type: Number, default: 0 },
});
// Index on clientId and createdAt for efficient querying
ChatSessionSchema.index({ clientId: 1, createdAt: -1 });
exports.ChatBotSessionModel = (0, mongoose_1.model)('ChatBotSession', ChatSessionSchema);
//# sourceMappingURL=chatBotSession.model.js.map