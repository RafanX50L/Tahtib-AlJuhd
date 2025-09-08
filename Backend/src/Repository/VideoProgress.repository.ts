import { Types } from 'mongoose';
import { BaseRepository } from './base.repository';
import { IVideoProgress } from '@/core/interface/model/IVideoProgress.model';
import { VideoProgressModel } from '@/models/VideoProgress.model';
import { IVideoProgressRepository } from '@/core/interface/repositories/IVideoProgress.repository';

export class VideoProgressRepository
  extends BaseRepository<IVideoProgress>
  implements IVideoProgressRepository
{
  constructor() {
    super(VideoProgressModel);
  }

  async upsert(userId: Types.ObjectId, videoId: string, watchPercent: number, avgPlaybackRate?: number) {
    const completed = watchPercent >= 90 && (avgPlaybackRate ?? 1) <= 1.5;
    const doc = await this.model.findOneAndUpdate(
      { user: userId, videoId },
      { $set: { watchPercent, avgPlaybackRate, completed } },
      { new: true, upsert: true }
    );
    return doc as IVideoProgress;
  }

  async get(userId: Types.ObjectId, videoId: string) {
    return this.model.findOne({ user: userId, videoId });
  }
}


