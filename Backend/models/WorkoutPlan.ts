
import { Schema, model, Document } from 'mongoose';

// Shared interfaces
interface IExercise {
  name: string;
  sets?: number;
  reps?: string;
  rest?: string;
  duration?: string;
  instructions: string;
  animationLink?: string;
}

interface IDay {
  title: string;
  exercises: IExercise[];
  completed: boolean;
  report?: {
    totalExercises: number;
    totalSets: number;
    estimatedDuration: string;
    caloriesBurned: number;
    intensity: string;
    feedback: string;
  };
}

interface IWeek {
  days: IDay[];
  completed: boolean;
}

interface IWorkoutPlan extends Document {
  weeks: IWeek[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true },
  sets: { type: Number, required: false },
  reps: { type: String, required: false },
  rest: { type: String, required: false },
  duration: { type: String, required: false },
  instructions: { type: String, required: true },
  animationLink: { type: String, default: 'No video available' },
});

const DaySchema = new Schema<IDay>({
  title: { type: String, required: true },
  exercises: [ExerciseSchema],
  completed: { type: Boolean, default: false },
  report: {
    totalExercises: Number,
    totalSets: Number,
    estimatedDuration: String,
    caloriesBurned: Number,
    intensity: String,
    feedback: String,
  },
});

const WeekSchema = new Schema<IWeek>({
  days: [DaySchema],
  completed: { type: Boolean, default: false },
});

const WorkoutPlanSchema = new Schema<IWorkoutPlan>({
  weeks: [WeekSchema],
  notes: { type: String, required: false },
}, { timestamps: true });

// Index
WorkoutPlanSchema.index({ _id: 1 });

export const WorkoutPlanModel = model<IWorkoutPlan>('WorkoutPlan', WorkoutPlanSchema);