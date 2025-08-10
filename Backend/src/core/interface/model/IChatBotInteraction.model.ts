import { Document, ObjectId } from "mongoose";

export interface IChatBotnteraction extends Document {
  sessionId: string | ObjectId;
  content: string;
  isUser: boolean;
  createdAt: Date;
}