import { IChallengesViews, IWeeklyChallengesView, IWorkoutReportView } from "@/dtos/client/weeklyChallengeDTO";
import { IExercise,  } from "../../model/IWorkoutPlan.model";
import { IUserWeeklyChallengeView } from "@/dtos/client/UserProgressDTO";

export interface IClientWeeklyChallengeService {
  /** Reserved for Weekly Challenge specific methods */
  _placeholder?: never;

  getWeeklyChallenges(): Promise<IWeeklyChallengesView | null>;
  getWeeklyChallengeById(
    id: string,
    userId: string
  ): Promise<{
    challenge: IChallengesViews | null;
    userProgress: IUserWeeklyChallengeView | null;
  }>;

  joinWeeklyChallenge(userId: string, challengeId: string): Promise<boolean>;
  markChallengeDayComplete(
    userId: string,
    workout: IExercise[],
    challengeId: string,
    dayIndex: number
  ): Promise<IWorkoutReportView>;
}
