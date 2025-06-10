// models/WeeklyChallenge.ts
import { Schema, model, Document, Types } from 'mongoose';
import { IExercise, IDay } from '../interface/IWorkout';

export type ChallengeType = 'beginner' | 'advanced'; // You can expand later if needed

// Full weekly challenge
export interface IWeeklyChallenge extends Document {
  type: ChallengeType;
  startDate: Date;
  endDate: Date;
  tasks: IDay[];
  enteredUsers: Types.ObjectId[];
  score: number; // for setting leaderboard scores it should different according to the type of challenge
}

// Sub-schemas
const ExerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true },
  sets: Number,
  reps: String,
  rest: String,
  instructions: String,
  animation_link: { type: String, required: false, default: 'No video available' }
});

const WeeklyDaySchema = new Schema<IDay>({
  title: { type: String, required: true },
  exercises: { type: [ExerciseSchema], required: true },
  completed: { type: Boolean, default: false },
  report: {
    type: Object,
    required: false,
    default: null
  }
});

// Main schema
const WeeklyChallengeSchema = new Schema<IWeeklyChallenge>({
  type: { type: String, enum: ['beginner','intermediate', 'advanced'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  tasks: { type: [WeeklyDaySchema], required: true },
  enteredUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  score: { type: Number, required: true } // for setting leaderboard scores it should different accoriding to the type of challenge
}, { timestamps: true });

export default model<IWeeklyChallenge>('WeeklyChallenge', WeeklyChallengeSchema);
