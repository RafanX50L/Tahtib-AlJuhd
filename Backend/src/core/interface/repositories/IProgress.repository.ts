import { IProgress, IProgressEntry } from '@/core/interface/model/IProgress.model';

export interface IProgressRepository {
  createIfNotExists(userId: string): Promise<IProgress>;
  addEntry(userId: string, entry: IProgressEntry): Promise<IProgress>;
  getLatestEntry(userId: string): Promise<IProgressEntry | null>;
  getEntriesInRange(userId: string, start: Date, end: Date): Promise<IProgressEntry[]>;
}


