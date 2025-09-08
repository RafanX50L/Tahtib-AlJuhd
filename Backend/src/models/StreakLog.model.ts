import { Schema, model } from 'mongoose';
import { IStreakLog } from '@/core/interface/model/IStreakLog.model';

const StreakLogSchema = new Schema<IStreakLog>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  streakType: { type: String, enum: ['daily', 'weekly'], required: true },
  streakCount: { type: Number, default: 0 },
  lastActivityDate: { type: Date, required: true },
}, { timestamps: true });

StreakLogSchema.index({ user: 1, streakType: 1 }, { unique: true });

export const StreakLogModel = model<IStreakLog>('StreakLog', StreakLogSchema);


