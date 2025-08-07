import { Document, Types } from 'mongoose';

export interface IUserDayReport {
  dayIndex: number;
  completed: boolean;
  report: {
    caloriesBurned: number;
    feedback: string;
    intensity: string;
    estimatedDuration: string;
    totalExercises: number;
    totalSets: number;
  };
  completedAt?: Date;
}

export interface IUserWeeklyChallenge extends Document {
  user: Types.ObjectId;
  challenge: Types.ObjectId;
  type: 'beginner' | 'intermediate' | 'advanced';
  startDate: Date;
  progress: IUserDayReport[];
  score: number;
  createdAt: Date;
  updatedAt: Date;
}