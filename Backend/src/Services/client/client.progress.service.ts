import { IClientProgressService, ICurrentStatusView, IGraphPointView } from '@/core/interface/services/client/IClient.Progress.Service';
import { IProgressEntry } from '@/core/interface/model/IProgress.model';
import { createHttpError } from '@/utils';
import { HttpStatus } from '@/constants/status.constant';
import { IProgressRepository } from '@/core/interface/repositories/IProgress.repository';

export class ClientProgressService implements IClientProgressService {
  constructor(private readonly _progressRepository: IProgressRepository) {}

  calculateBmi(weightKg: number, heightCm: number): { bmi: number; bmiCategory: string } {
    const heightMeters = heightCm / 100;
    const bmiValue = weightKg > 0 && heightMeters > 0 ? weightKg / (heightMeters * heightMeters) : 0;
    const bmi = Math.round(bmiValue * 10) / 10;
    let bmiCategory = 'Normal';
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi < 25) bmiCategory = 'Normal';
    else if (bmi < 30) bmiCategory = 'Overweight';
    else bmiCategory = 'Obese';
    return { bmi, bmiCategory };
  }

  async addEntry(userId: string, date: Date, weightKg: number, heightCm: number): Promise<void> {
    await this._progressRepository.createIfNotExists(userId);
    // Enforce: only one saved entry per calendar week
    const latest = await this._progressRepository.getLatestEntry(userId);
    if (latest) {
      const last = new Date(latest.date);
      const curr = new Date(date);
      const lastWeek = getISOWeekNumber(last);
      const currWeek = getISOWeekNumber(curr);
      if (lastWeek.year === currWeek.year && lastWeek.week === currWeek.week) {
        throw createHttpError(HttpStatus.BAD_REQUEST,'Only one entry can be saved per week. You can preview today\'s stats without saving.');
      }
    }
    const { bmi, bmiCategory } = this.calculateBmi(weightKg, heightCm);
    const entry: IProgressEntry = {
      date,
      weight: weightKg,
      height: heightCm,
      bmi,
      bmiCategory: bmiCategory as IProgressEntry['bmiCategory'],
    };
    await this._progressRepository.addEntry(userId, entry);
  }

  async getCurrentStatus(userId: string): Promise<ICurrentStatusView | null> {
    const latest = await this._progressRepository.getLatestEntry(userId);
    if (!latest) return null;
    return {
      date: latest.date.toISOString(),
      weight: latest.weight,
      height: latest.height,
      bmi: latest.bmi.toFixed(1),
      bmiCategory: latest.bmiCategory,
    };
  }

  async getGraphData(userId: string, start: Date, end: Date): Promise<IGraphPointView[]> {
    const entries = await this._progressRepository.getEntriesInRange(userId, start, end);
    return entries.map((e) => ({ date: e.date.toISOString(), weight: e.weight, bmi: e.bmi }));
  }

  async previewEntry(date: Date, weightKg: number, heightCm: number): Promise<ICurrentStatusView> {
    const { bmi, bmiCategory } = this.calculateBmi(weightKg, heightCm);
    return {
      date: date.toISOString(),
      weight: weightKg,
      height: heightCm,
      bmi: bmi.toFixed(1),
      bmiCategory,
    };
  }
}

function getISOWeekNumber(d: Date): { year: number; week: number } {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { year: date.getUTCFullYear(), week: weekNo };
}


