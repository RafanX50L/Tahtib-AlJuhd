import { Types } from 'mongoose';
import { IVideoProgress } from '@/core/interface/model/IVideoProgress.model';

export interface IVideoProgressRepository {
  upsert(userId: Types.ObjectId, videoId: string, watchPercent: number, avgPlaybackRate?: number): Promise<IVideoProgress>;
  get(userId: Types.ObjectId, videoId: string): Promise<IVideoProgress | null>;
}


