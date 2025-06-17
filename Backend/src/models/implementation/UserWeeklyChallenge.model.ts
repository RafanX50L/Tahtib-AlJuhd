import { Schema, model, Document, Types } from "mongoose";

export interface IUserDayReport {
  dayIndex: number; // 0 for Day 1, 1 for Day 2, etc.
  completed: boolean;
  report: {
    caloriesBurned: number; // Example value
    feedback: string; // Example feedback
    intensity: string;
    estimatedDuration: string;
    totalExercises: number;
    totalSets: number;
  };
  completedAt: Date;
}

export interface IUserWeeklyChallenge extends Document {
  user: Types.ObjectId;
  challenge: Types.ObjectId; // Refers to WeeklyChallenge
  type: "beginner" | "advanced";
  startDate: Date;
  progress: IUserDayReport[];
  score: number;
}

const DayReportSchema = new Schema<IUserDayReport>({
  dayIndex: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  report: {
    totalExercises: String,
    totalSets: String,
    estimatedDuration: String,
    caloriesBurned: String,
    intensity: String,
    feedback: String
  },
  completedAt: { type: Date, default: null },
});

const UserWeeklyChallengeSchema = new Schema<IUserWeeklyChallenge>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  challenge: {
    type: Schema.Types.ObjectId,
    ref: "WeeklyChallenge",
    required: true,
  },
  type: { type: String, enum: ["beginner", "advanced"], required: true },
  startDate: { type: Date, required: true },
  progress: { type: [DayReportSchema], default: [] },
  score: { type: Number, default: 0 },
});

export default model<IUserWeeklyChallenge>(
  "UserWeeklyChallenge",
  UserWeeklyChallengeSchema
);
