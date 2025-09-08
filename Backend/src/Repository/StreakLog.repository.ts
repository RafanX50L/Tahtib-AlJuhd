import { Types } from 'mongoose';
import { BaseRepository } from './base.repository';
import { IStreakLog } from '@/core/interface/model/IStreakLog.model';
import { StreakLogModel } from '@/models/StreakLog.model';
import { IStreakLogRepository } from '@/core/interface/repositories/IStreakLog.repository';

export class StreakLogRepository
  extends BaseRepository<IStreakLog>
  implements IStreakLogRepository
{
  constructor() {
    super(StreakLogModel);
  }

  async bump(userId: Types.ObjectId, streakType: 'daily'|'weekly', activityDate: Date): Promise<IStreakLog> {
    const doc = await this.model.findOne({ user: userId, streakType });
    if (!doc) {
      return (await this.create({ user: userId, streakType, streakCount: 1, lastActivityDate: activityDate })) as IStreakLog;
    }
    const last = new Date(doc.lastActivityDate);
    const sameDay = last.toDateString() === activityDate.toDateString();
    const nextDay = new Date(last);
    nextDay.setDate(last.getDate() + 1);
    const isConsecutive = nextDay.toDateString() === activityDate.toDateString();
    const newCount = sameDay ? doc.streakCount : (isConsecutive ? doc.streakCount + 1 : 1);
    doc.streakCount = newCount;
    doc.lastActivityDate = activityDate;
    await doc.save();
    return doc;
  }

  async get(userId: Types.ObjectId, streakType: 'daily'|'weekly') {
    return this.model.findOne({ user: userId, streakType });
  }
}


