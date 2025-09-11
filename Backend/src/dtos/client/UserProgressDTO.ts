import { IUserWeeklyChallenge } from "@/core/interface/model/IUserWeeklyChallenge.model";

interface IUserDayReportView {
  dayIndex: number;
  completed: boolean;
  completedAt: Date;
  report: {
    caloriesBurned: string;
    feedback: string;
    intensity: string;
    estimatedDuration: string;
    totalExercises: string;
    totalSets: string;
  };
}

export interface IUserWeeklyChallengeView {
  user: string;
  challenge: string;
  type: string;
  startDate: string;
  progress: IUserDayReportView[];
  score: number;
}

export class UserProgressDTO {
  static async mapToUserProgress(
    raw: IUserWeeklyChallenge
  ): Promise<IUserWeeklyChallengeView> {
    return {
      user: raw.user? raw.user.toString() : null,
      challenge: raw.challenge.toString(),
      type: raw.type,
      startDate: raw.startDate.toDateString(),
      score: raw.score,
      progress: raw.progress.map(
        (day): IUserDayReportView => ({
          dayIndex: day.dayIndex,
          completed: day.completed,
          completedAt: day.completedAt ?? null,
          report: {
            caloriesBurned: day.report.caloriesBurned.toString(),
            feedback: day.report.feedback,
            intensity: day.report.intensity,
            estimatedDuration: day.report.estimatedDuration,
            totalExercises: day.report.totalExercises.toString(),
            totalSets: day.report.totalSets.toString(),
          },
        })
      ),
    };
  }
}
