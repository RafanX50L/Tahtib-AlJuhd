import { IProgressEntry } from '@/core/interface/model/IProgress.model';
import { ICurrentStatusView, IGraphPointView } from '@/core/interface/services/client/IClient.Progress.Service';

export class ProgressDTO {
  static toCurrentStatus(entry: IProgressEntry | null): ICurrentStatusView | null {
    if (!entry) return null;
    return {
      date: entry.date.toISOString(),
      weight: entry.weight,
      height: entry.height,
      bmi: entry.bmi.toFixed(1),
      bmiCategory: entry.bmiCategory,
    };
  }

  static toGraph(points: IProgressEntry[]): IGraphPointView[] {
    return points.map((e) => ({ date: e.date.toISOString(), weight: e.weight, bmi: e.bmi }));
  }
}


