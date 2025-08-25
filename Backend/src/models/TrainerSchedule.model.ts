import { Schema, model } from 'mongoose';

export interface ITrainerSchedule {
  trainerId: Schema.Types.ObjectId;
  weeklySchedule: {
    [key: string]: {
      isAvailable: boolean;
      timeSlots: Array<{
        startTime: string; // Format: "09:00"
        endTime: string;   // Format: "17:00"
        duration: number;  // Duration in minutes (30, 60, 90, etc.)
        price: number;     // Price per session
      }>;
    };
  };
  timezone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TrainerScheduleSchema = new Schema<ITrainerSchedule>({
  trainerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  weeklySchedule: {
    monday: {
      isAvailable: { type: Boolean, default: false },
      timeSlots: [{
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        duration: { type: Number, required: true, min: 15, max: 480 },
        price: { type: Number, required: true, min: 0 }
      }]
    },
    tuesday: {
      isAvailable: { type: Boolean, default: false },
      timeSlots: [{
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        duration: { type: Number, required: true, min: 15, max: 480 },
        price: { type: Number, required: true, min: 0 }
      }]
    },
    wednesday: {
      isAvailable: { type: Boolean, default: false },
      timeSlots: [{
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        duration: { type: Number, required: true, min: 15, max: 480 },
        price: { type: Number, required: true, min: 0 }
      }]
    },
    thursday: {
      isAvailable: { type: Boolean, default: false },
      timeSlots: [{
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        duration: { type: Number, required: true, min: 15, max: 480 },
        price: { type: Number, required: true, min: 0 }
      }]
    },
    friday: {
      isAvailable: { type: Boolean, default: false },
      timeSlots: [{
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        duration: { type: Number, required: true, min: 15, max: 480 },
        price: { type: Number, required: true, min: 0 }
      }]
    },
    saturday: {
      isAvailable: { type: Boolean, default: false },
      timeSlots: [{
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        duration: { type: Number, required: true, min: 15, max: 480 },
        price: { type: Number, required: true, min: 0 }
      }]
    },
    sunday: {
      isAvailable: { type: Boolean, default: false },
      timeSlots: [{
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        duration: { type: Number, required: true, min: 15, max: 480 },
        price: { type: Number, required: true, min: 0 }
      }]
    }
  },
  timezone: { 
    type: String, 
    required: true, 
    default: 'UTC' 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

export const TrainerScheduleModel = model<ITrainerSchedule>('TrainerSchedule', TrainerScheduleSchema);
