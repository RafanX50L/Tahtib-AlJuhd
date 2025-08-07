import { Schema, model, Document, Types } from 'mongoose';

interface IChatbotInteraction extends Document {
  clientId: Types.ObjectId;
  question: string;
  response: string;
  createdAt: Date;
}

const ChatbotInteractionSchema = new Schema<IChatbotInteraction>({
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Index
ChatbotInteractionSchema.index({ clientId: 1, createdAt: -1 });

export const ChatbotInteractionModel = model<IChatbotInteraction>('ChatbotInteraction', ChatbotInteractionSchema);
