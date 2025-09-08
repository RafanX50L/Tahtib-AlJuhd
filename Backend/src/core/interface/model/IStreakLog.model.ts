import { Document, Types } from 'mongoose';

export interface IStreakLog extends Document {
  user: Types.ObjectId;
  streakType: 'daily' | 'weekly';
  streakCount: number;
  lastActivityDate: Date;
  createdAt: Date;
  updatedAt: Date;
}


