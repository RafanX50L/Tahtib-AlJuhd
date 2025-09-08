import { Document, Types } from 'mongoose';

export interface IExerciseProgress {
  exerciseId: string;
  completedReps?: number;
  completedSets?: number;
  durationSec?: number;
  status: 'pending' | 'completed';
  completedAt?: Date;
}

export interface IWorkoutProgress extends Document {
  user: Types.ObjectId;
  workoutPlanId: Types.ObjectId;
  weekKey: 'week1' | 'week2' | 'week3' | 'week4';
  dayKey: 'day1' | 'day2' | 'day3' | 'day4' | 'day5' | 'day6' | 'day7';
  exercises: IExerciseProgress[];
  completionPercentage: number;
  status: 'in_progress' | 'completed';
  version: number;
  createdAt: Date;
  updatedAt: Date;
}


