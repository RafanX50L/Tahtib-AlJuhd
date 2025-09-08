import { Schema, model } from 'mongoose';
import { IVideoProgress } from '@/core/interface/model/IVideoProgress.model';

const VideoProgressSchema = new Schema<IVideoProgress>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  videoId: { type: String, required: true },
  watchPercent: { type: Number, min: 0, max: 100, default: 0 },
  avgPlaybackRate: { type: Number, required: false },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

VideoProgressSchema.index({ user: 1, videoId: 1 }, { unique: true });

export const VideoProgressModel = model<IVideoProgress>('VideoProgress', VideoProgressSchema);


