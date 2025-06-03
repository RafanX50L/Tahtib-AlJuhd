// models/WeeklyChallenge.ts
import { Schema, model, Document, Types } from 'mongoose';

// Exercise sub-document
interface IExercise {
  name: string;
  durationMinutes?: number;
  sets?: number;
  reps?: number;
  note?: string;
}

// Per-day exercise list
interface IWeeklyDay {
  day: number; // 1 to 7
  exercises: IExercise[];
}

// Full weekly challenge
export interface IWeeklyChallenge extends Document {
  startDate: Date;
  endDate: Date;
  tasks: IWeeklyDay[];
  enteredUsers: Types.ObjectId[];
  createdAt: Date;
}

// Sub-schemas
const ExerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true },
  durationMinutes: Number,
  sets: Number,
  reps: Number,
  note: String
});

const WeeklyDaySchema = new Schema<IWeeklyDay>({
  day: { type: Number, required: true },
  exercises: { type: [ExerciseSchema], required: true }
});

// Main schema
const WeeklyChallengeSchema = new Schema<IWeeklyChallenge>({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  tasks: { type: [WeeklyDaySchema], required: true },
  enteredUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Users who joined
  createdAt: { type: Date, default: Date.now }
});

export default model<IWeeklyChallenge>('WeeklyChallenge', WeeklyChallengeSchema);
