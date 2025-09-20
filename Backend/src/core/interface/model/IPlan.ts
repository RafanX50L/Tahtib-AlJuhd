import { Document, Types } from 'mongoose';

export interface IPlan extends Document {
  trainerId: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  sessionsPerWeek: number;
  durationWeeks: number;
  isActive: boolean;
  isBooked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}