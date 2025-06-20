import mongoose, { Schema } from "mongoose";

export interface TrainerInterviewSchedule {
  adminID: string;
  trainerID: string;
  startTime: Date;
  endTime: Date;
  date: Date;
  roomID: string;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
  result: {
    communicationSkills: number;
    technicalKnowledge: number;
    coachingStyle: number;
    confidencePresence: number;
    brandAlignment: number;
    equipmentQuality: number;
    notes: string;
  };
}

const resultSchema = new Schema({
  communicationSkills: { type: Number, default: 0 },
  technicalKnowledge: { type: Number, default: 0 },
  coachingStyle: { type: Number, default: 0 },
  confidencePresence: { type: Number, default: 0 },
  brandAlignment: { type: Number, default: 0 },
  equipmentQuality: { type: Number, default: 0 },
  notes: { type: String, default: "" },
}, { _id: false }); // prevent automatic _id generation for subdocs

const scheduleSchema = new Schema<TrainerInterviewSchedule>({
  adminID: { type: String, required: true },
  trainerID: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  date: { type: Date, required: true },
  roomID: { type: String, required: true },
  completed: { type: Boolean, default: false, required: true },
  result: { type: resultSchema, default: () => ({}) },
}, { timestamps: true });

export const TrainerInterviewModel = mongoose.model<TrainerInterviewSchedule>('Schedule', scheduleSchema);
