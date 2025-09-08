import { Schema, model } from 'mongoose';
import { IExerciseProgress, IWorkoutProgress } from '@/core/interface/model/IWorkoutProgress.model';

const ExerciseProgressSchema = new Schema<IExerciseProgress>({
  exerciseId: { type: String, required: true },
  completedReps: { type: Number, required: false },
  completedSets: { type: Number, required: false },
  durationSec: { type: Number, required: false },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  completedAt: { type: Date, required: false },
});

const WorkoutProgressSchema = new Schema<IWorkoutProgress>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  workoutPlanId: { type: Schema.Types.ObjectId, ref: 'WorkoutPlan', required: true, index: true },
  weekKey: { type: String, enum: ['week1', 'week2', 'week3', 'week4'], required: true },
  dayKey: { type: String, enum: ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7'], required: true },
  exercises: { type: [ExerciseProgressSchema], default: [] },
  completionPercentage: { type: Number, default: 0 },
  status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
  version: { type: Number, default: 1 },
}, { timestamps: true });

WorkoutProgressSchema.index({ user: 1, workoutPlanId: 1, weekKey: 1, dayKey: 1 }, { unique: true });

export const WorkoutProgressModel = model<IWorkoutProgress>('WorkoutProgress', WorkoutProgressSchema);


