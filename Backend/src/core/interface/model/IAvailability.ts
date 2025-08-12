import { Types } from 'mongoose';

export interface IAvailability {
  _id?: Types.ObjectId;
  trainerId: Types.ObjectId;
  slots: Array<{
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    startTime: string; // 'HH:mm'
    endTime: string;
  }>;
};