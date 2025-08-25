import { Document } from 'mongoose';

export interface ITrainerSchedule extends Document {
  trainerId: string;
  weeklySchedule: {
    [key: string]: {
      isAvailable: boolean;
      timeSlots: Array<{
        startTime: string;
        endTime: string;
        duration: number;
        price: number;
      }>;
    };
  };
  timezone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
