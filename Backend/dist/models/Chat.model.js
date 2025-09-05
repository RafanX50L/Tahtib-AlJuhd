import { Schema, model } from 'mongoose';
const ChatSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [{
            senderId: { type: Schema.Types.ObjectId, ref: 'User' },
            content: String,
            timestamp: { type: Date, default: Date.now },
        }],
}, { timestamps: true });
export const ChatModel = model('Chat', ChatSchema);
//# sourceMappingURL=Chat.model.js.map