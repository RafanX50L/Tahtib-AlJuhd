import { HttpResponse } from "@/constants/response-message.constant";
import { HttpStatus } from "@/constants/status.constant";
import {
  IUserDayReport,
  IUserWeeklyChallenge,
} from "@/core/interface/model/IUserWeeklyChallenge.model";
import { IWeeklyChallenge } from "@/core/interface/model/IWeeklyChallenge.models";
import {
  IExercise,
  IWorkoutReport,
} from "@/core/interface/model/IWorkoutPlan.model";
import { IUserWeeklyChallengeRepository } from "@/core/interface/repositories/IUserWeeklyChallenge.repositoy";
import { IWeeklyChallengeRepository } from "@/core/interface/repositories/IWeeklyChallenge.repository";
import { IClientWeeklyChallengeService } from "@/core/interface/services/client/IClient.WeeklyChallenge.service";
import { UserProgressDTO } from "@/dtos/client/UserProgressDTO";
import { ClientWeeklyChallengeDTO, IWeeklyChallengesView } from "@/dtos/client/weeklyChallengeDTO";
import { createHttpError } from "@/utils";
// import { generateWorkoutReport } from "@/utils/gemini1.utils";
import { Types } from "mongoose";

export class ClientWeeklyChallengeService
  implements IClientWeeklyChallengeService
{
  constructor(
    private readonly _weeklyChallengeRepository: IWeeklyChallengeRepository,
    private readonly _userWeeklyChallengeRepository: IUserWeeklyChallengeRepository
  ) {}
  /** Reserved for Weekly Challenge specific methods */
  _placeholder?: never;

  async getWeeklyChallenges(): Promise<IWeeklyChallengesView> {
    const now = new Date();

    // Fetch all three types that are still active (not expired)
    const challenges = await this._weeklyChallengeRepository.findAll({
      type: { $in: ["beginner", "intermediate", "advanced"] },
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    // Initialize with nulls (temporarily)
    const result: Partial<IWeeklyChallengesView> = {
      beginner: null,
      intermediate: null,
      advanced: null,
    };

    for (const challenge of challenges) {
      result[challenge.type] = await ClientWeeklyChallengeDTO.mapToWeeeklyChallengeData(challenge);
    }

    return result as IWeeklyChallengesView;
  }

  async getWeeklyChallengeById(id: string, userId: string) {
    const challenge = (await this._weeklyChallengeRepository.findById(
      new Types.ObjectId(id)
    )) as IWeeklyChallenge | null;

    const userProgress = (await this._userWeeklyChallengeRepository.findOne({
      user: new Types.ObjectId(userId),
      challenge: new Types.ObjectId(id),
    })) as IUserWeeklyChallenge | null;
    console.log("User Progress:", userProgress);
    if(!userProgress){
      const challengeData = await ClientWeeklyChallengeDTO.mapTooOneWeeklyChallengeData(challenge);
  
      return { challenge:challengeData };
    }


    const challengeData = await ClientWeeklyChallengeDTO.mapTooOneWeeklyChallengeData(challenge);
    const userProgressDTO = await UserProgressDTO.mapToUserProgress(userProgress);

    return { challenge:challengeData, userProgress:userProgressDTO };
  };

  async joinWeeklyChallenge(userId: string, challengeId: string) {
    // Step 1: Fetch the challenge
    const challenge = await this._weeklyChallengeRepository.findById(
      new Types.ObjectId(challengeId)
    );
    if (!challenge) {
      throw new Error("Challenge not found");
    }

    // Step 2: Check if user already joined
    const hasJoined = challenge.enteredUsers.includes(
      new Types.ObjectId(userId)
    );
    if (hasJoined) {
      throw createHttpError(
        HttpStatus.CONFLICT,
        HttpResponse.USER_ALREADY_JOINED_CHALLENGE
      );
    }

    // Step 3: Add user to enteredUsers
    await this._weeklyChallengeRepository.update(challengeId, {
      $addToSet: { enteredUsers: userId },
    });

    await this._userWeeklyChallengeRepository.create({
      user: new Types.ObjectId(userId),
      challenge: new Types.ObjectId(challengeId),
      type: challenge.type,
      startDate: new Date(),
      progress: [],
      score: 0,
    });

    return true;
  }

  async markChallengeDayComplete(
    userId: string,
    workout: IExercise[],
    challengeId: string,
    dayIndex: number
  ): Promise<IWorkoutReport> {
    const defaultReport = {
      caloriesBurned: 500, // Example value
      duration: 60, // Example value in minutes
      feedback: "Great job! Keep it up!", // Example feedback
      intensity: "low",
      estimatedDuration: "60 minutes",
      totalExercises: 5,
      totalSets: 15,
    };
    // 1. Generate report
    const report = defaultReport;
    // workout.length === 0
    //   ? defaultReport
    //   : await generateWorkoutReport(workout);

    const newDayReport: IUserDayReport = {
      dayIndex,
      completed: true,
      completedAt: new Date(),
      report: report,
    };

    await this._userWeeklyChallengeRepository.markChallengeDayComplete(
      userId,
      challengeId,
      newDayReport
    );

    return report;
  }
}
