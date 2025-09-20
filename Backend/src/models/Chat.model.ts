import { IChat } from '@/core/interface/model/IChat';
import { Schema, model } from 'mongoose';

const ChatSchema = new Schema<IChat>({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [{
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
    timestamp: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

export const ChatModel = model<IChat>('Chat', ChatSchema);