import { Document, Types } from 'mongoose';

export interface IChat extends Document {
  participants: Types.ObjectId[]; // [trainerId, clientId]
  messages: Array<{
    senderId: Types.ObjectId;
    content: string;
    timestamp: Date;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}