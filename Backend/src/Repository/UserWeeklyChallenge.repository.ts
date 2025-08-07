import {
  IUserDayReport,
  IUserWeeklyChallenge,
} from "@/core/interface/model/IUserWeeklyChallenge.model";
import { BaseRepository } from "./base.repository";
import { UserWeeklyChallengeModel } from "@/models/UserWeeklyChallenge.model";
import { IUserWeeklyChallengeRepository } from "@/core/interface/repositories/IUserWeeklyChallenge.repositoy";
import { Types } from "mongoose";

export class UserWeeklyChallengeRepository
  extends BaseRepository<IUserWeeklyChallenge>
  implements IUserWeeklyChallengeRepository
{
  constructor() {
    super(UserWeeklyChallengeModel);
  }
  /** Reserved for User Filespecific methods */
  _placeholder?: never;

  async markChallengeDayComplete(
    userId: string,
    challengeId: string,
    DayReport: IUserDayReport
  ) {
    return await this.model.findOneAndUpdate(
      {
        user: new Types.ObjectId(userId),
        challenge: new Types.ObjectId(challengeId),
      },
      { $addToSet: { progress: DayReport } }
    );
  }
}
