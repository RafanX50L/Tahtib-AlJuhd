import { IChatBotnteraction } from '@/core/interface/model/IChatBotInteraction.model';
import { Schema, model } from 'mongoose';


const InteractionSchema = new Schema<IChatBotnteraction>({
  sessionId: { type: Schema.Types.ObjectId, ref: 'ChatBotSession', required: true },
  content: { type: String, required: true },
  isUser: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Index on sessionId and createdAt for efficient querying
InteractionSchema.index({ sessionId: 1, createdAt: 1 });

export const ChatBotInteractionModel = model<IChatBotnteraction>('ChatBotInteraction', InteractionSchema);