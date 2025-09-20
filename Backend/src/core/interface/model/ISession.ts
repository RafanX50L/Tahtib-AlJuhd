import { Document, Types } from 'mongoose';

export interface ISession extends Document{
  trainerId: Types.ObjectId;
  clientId: Types.ObjectId;
  planId: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: "free" | 'booked' | 'completed' | 'cancelled';
  meetingLink: string;
  createdAt?: Date;
  updatedAt?: Date;
}