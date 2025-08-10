import { Document, ObjectId } from "mongoose";

export interface IChatBotSession extends Document {
  clientId: string | ObjectId;
  title?: string;
  lastInteraction: string;
  createdAt: Date;
  messageCount: number;
}