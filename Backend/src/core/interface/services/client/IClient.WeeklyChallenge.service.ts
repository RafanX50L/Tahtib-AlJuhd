import { IUserWeeklyChallenge } from "../../model/IUserWeeklyChallenge.model";
import { IWeeklyChallenge } from "../../model/IWeeklyChallenge.models";
import { IExercise, IWorkoutReport } from "../../model/IWorkoutPlan.model";

type ChallengeTypes = "beginner" | "intermediate" | "advanced";
export interface IClientWeeklyChallengeService {
  /** Reserved for Weekly Challenge specific methods */
  _placeholder?: never;

  getWeeklyChallenges(): Promise<
    Record<ChallengeTypes, IWeeklyChallenge | null>
  >;
  getWeeklyChallengeById(
    id: string,
    userId: string
  ): Promise<{
    challenge: IWeeklyChallenge | null;
    userProgress: IUserWeeklyChallenge | null;
  }>;

  joinWeeklyChallenge(userId: string, challengeId: string): Promise<boolean>;
  markChallengeDayComplete(
    userId: string,
    workout: IExercise[],
    challengeId: string,
    dayIndex: number
  ): Promise<IWorkoutReport>;
}
