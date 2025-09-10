import { IProgressEntry } from '@/core/interface/model/IProgress.model';

export interface ICurrentStatusView {
  date: string;
  weight: number;
  height: number;
  bmi: string;
  bmiCategory: string;
}

export interface IGraphPointView {
  date: string;
  weight: number;
  bmi: number;
}

export interface IClientProgressService {
  calculateBmi(weightKg: number, heightCm: number): { bmi: number; bmiCategory: string };
  addEntry(userId: string, date: Date, weightKg: number, heightCm: number): Promise<void>;
  getCurrentStatus(userId: string): Promise<ICurrentStatusView | null>;
  getGraphData(userId: string, start: Date, end: Date): Promise<IGraphPointView[]>;
  previewEntry(date: Date, weightKg: number, heightCm: number): Promise<ICurrentStatusView>;
}


