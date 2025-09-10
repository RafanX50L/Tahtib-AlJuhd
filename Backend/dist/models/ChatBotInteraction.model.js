"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatBotInteractionModel = void 0;
const mongoose_1 = require("mongoose");
const InteractionSchema = new mongoose_1.Schema({
    sessionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ChatBotSession', required: true },
    content: { type: String, required: true },
    isUser: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
});
// Index on sessionId and createdAt for efficient querying
InteractionSchema.index({ sessionId: 1, createdAt: 1 });
exports.ChatBotInteractionModel = (0, mongoose_1.model)('ChatBotInteraction', InteractionSchema);
//# sourceMappingURL=ChatBotInteraction.model.js.map