import { Types } from 'mongoose';
import { IStreakLog } from '@/core/interface/model/IStreakLog.model';

export interface IStreakLogRepository {
  bump(userId: Types.ObjectId, streakType: 'daily'|'weekly', activityDate: Date): Promise<IStreakLog>;
  get(userId: Types.ObjectId, streakType: 'daily'|'weekly'): Promise<IStreakLog | null>;
}


