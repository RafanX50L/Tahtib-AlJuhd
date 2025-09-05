import { Schema, model } from 'mongoose';
const ChatSessionSchema = new Schema({
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String },
    lastInteraction: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    messageCount: { type: Number, default: 0 },
});
// Index on clientId and createdAt for efficient querying
ChatSessionSchema.index({ clientId: 1, createdAt: -1 });
export const ChatBotSessionModel = model('ChatBotSession', ChatSessionSchema);
//# sourceMappingURL=chatBotSession.model.js.map