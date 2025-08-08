import { Schema, model, Document, Types } from 'mongoose';

interface IUserDayReport {
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

interface IUserWeeklyChallenge extends Document {
  user: Types.ObjectId;
  challenge: Types.ObjectId;
  type: 'beginner' | 'intermediate' | 'advanced';
  startDate: Date;
  progress: IUserDayReport[];
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

const DayReportSchema = new Schema<IUserDayReport>({
  dayIndex: { type: Number, required: true, min: 0, max: 6 },
  completed: { type: Boolean, default: false },
  report: {
    totalExercises: { type: Number, required: false },
    totalSets: { type: Number, required: false },
    estimatedDuration: { type: String, required: false },
    caloriesBurned: { type: Number, required: false },
    intensity: { type: String, required: false },
    feedback: { type: String, required: false },
  },
  completedAt: { type: Date, required: false },
});

const UserWeeklyChallengeSchema = new Schema<IUserWeeklyChallenge>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  challenge: { type: Schema.Types.ObjectId, ref: 'WeeklyChallenge', required: true },
  type: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  startDate: { type: Date, required: true },
  progress: { type: [DayReportSchema], default: [], validate: [v => v.length <= 7, 'Progress cannot exceed 7 days'] },
  score: { type: Number, default: 0 },
}, { timestamps: true });

// Index
UserWeeklyChallengeSchema.index({ user: 1, challenge: 1 });

export const UserWeeklyChallengeModel = model<IUserWeeklyChallenge>('UserWeeklyChallenge', UserWeeklyChallengeSchema);
