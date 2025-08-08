
import { Document, Types } from 'mongoose';
import { IDay } from './IWorkoutPlan.model';

export interface IWeeklyChallenge extends Document {
  type: 'beginner' | 'intermediate' | 'advanced';
  startDate: Date;
  endDate: Date;
  tasks: IDay[];
  enteredUsers: Types.ObjectId[];
  score: number;
  createdAt: Date;
  updatedAt: Date;
}
