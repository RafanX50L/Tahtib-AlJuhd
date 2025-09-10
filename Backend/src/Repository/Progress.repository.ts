import { BaseRepository } from './base.repository';
import { IProgress, IProgressEntry } from '@/core/interface/model/IProgress.model';
import { ProgressModel } from '@/models/Progress.model';
import { IProgressRepository } from '@/core/interface/repositories/IProgress.repository';
import { Types } from 'mongoose';

export class ProgressRepository extends BaseRepository<IProgress> implements IProgressRepository {
  constructor() {
    super(ProgressModel);
  }

  async createIfNotExists(userId: string): Promise<IProgress> {
    const userObjectId = new Types.ObjectId(userId);
    const found = await this.model.findOne({ user: userObjectId });
    if (found) return found;
    const created = await this.model.create({ user: userObjectId, entries: [] });
    return created;
  }

  async addEntry(userId: string, entry: IProgressEntry): Promise<IProgress> {
    const userObjectId = new Types.ObjectId(userId);
    const updated = await this.model.findOneAndUpdate(
      { user: userObjectId },
      { $push: { entries: { $each: [entry], $position: 0 } } },
      { new: true, upsert: true }
    );
    return updated as IProgress;
  }

  async getLatestEntry(userId: string): Promise<IProgressEntry | null> {
    const userObjectId = new Types.ObjectId(userId);
    const doc = await this.model
      .findOne({ user: userObjectId }, { entries: { $slice: 1 } })
      .lean<IProgress | null>();
    return doc && doc.entries.length > 0 ? doc.entries[0] : null;
  }

  async getEntriesInRange(userId: string, start: Date, end: Date): Promise<IProgressEntry[]> {
    const userObjectId = new Types.ObjectId(userId);
    const result = await this.model.aggregate<{
      entries: IProgressEntry[];
    }>([
      { $match: { user: userObjectId } },
      { $unwind: '$entries' },
      { $match: { 'entries.date': { $gte: start, $lte: end } } },
      { $sort: { 'entries.date': 1 } },
      { $group: { _id: '$_id', entries: { $push: '$entries' } } },
      { $project: { _id: 0, entries: 1 } },
    ]);
    return result[0]?.entries ?? [];
  }
}


