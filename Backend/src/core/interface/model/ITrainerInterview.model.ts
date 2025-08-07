import { Document, ObjectId } from "mongoose";

export interface ITrainerInterview extends Document {
  adminId: string | ObjectId; // References User
  trainerId: string | ObjectId; // References Personalization
  startTime: Date;
  endTime: Date;
  date: Date;
  roomId: string;
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
  createdAt: Date;
  updatedAt: Date;
}