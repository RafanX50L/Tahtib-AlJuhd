import { Schema, model, Document, Types } from 'mongoose';

interface IMessage {
  senderId: Types.ObjectId;
  content: string;
  createdAt: Date;
}

interface IChat extends Document {
  trainerId: Types.ObjectId;
  clientId: Types.ObjectId;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ChatSchema = new Schema<IChat>({
  trainerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messages: { 
    type: [MessageSchema], 
    default: [], 
    validate: [v => v.length <= 1000, 'Messages cannot exceed 1000'] 
  },
}, { timestamps: true });

// Indexes
ChatSchema.index({ trainerId: 1, clientId: 1 });
ChatSchema.index({ createdAt: -1 });

export const ChatModel = model<IChat>('Chat', ChatSchema);
