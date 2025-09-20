import { Document, Types } from 'mongoose';

export interface ITrainerClientContract extends Document {
  trainerId: Types.ObjectId;
  clientId: Types.ObjectId;
  planId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  sessionsRemaining: number;
  chatId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}