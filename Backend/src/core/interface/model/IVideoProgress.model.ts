import { Document, Types } from 'mongoose';

export interface IVideoProgress extends Document {
  user: Types.ObjectId;
  videoId: string;
  watchPercent: number;
  avgPlaybackRate?: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}


