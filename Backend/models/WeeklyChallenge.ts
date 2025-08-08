
import { Schema, model, Document, Types } from 'mongoose';

interface IExercise {
  name: string;
  sets?: number;
  reps?: string;
  rest?: string;
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

interface IWeeklyChallenge extends Document {
  type: 'beginner' | 'intermediate' | 'advanced';
  startDate: Date;
  endDate: Date;
  tasks: IDay[];
  enteredUsers: Types.ObjectId[];
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true },
  sets: { type: Number, required: false },
  reps: { type: String, required: false },
  rest: { type: String, required: false },
  instructions: { type: String, required: true },
  animationLink: { type: String, default: 'No video available' },
});

const DaySchema = new Schema<IDay>({
  title: { type: String, required: true },
  exercises: { type: [ExerciseSchema], required: true },
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

const WeeklyChallengeSchema = new Schema<IWeeklyChallenge>({
  type: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  tasks: [DaySchema],
  enteredUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  score: { type: Number, required: true },
}, { timestamps: true });

// Index
WeeklyChallengeSchema.index({ type: 1, startDate: 1 });

export const WeeklyChallengeModel = model<IWeeklyChallenge>('WeeklyChallenge', WeeklyChallengeSchema);
