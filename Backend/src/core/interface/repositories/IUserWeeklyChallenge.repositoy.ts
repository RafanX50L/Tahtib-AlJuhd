import { IUserDayReport, IUserWeeklyChallenge } from "../model/IUserWeeklyChallenge.model";
import { IBaseRepository } from "./IBase.repository";

export interface IUserWeeklyChallengeRepository extends IBaseRepository<IUserWeeklyChallenge> {
    /** Reserved for User Weekly Challenge pecific methods */
    _placeholder?: never;

    markChallengeDayComplete(userId:string,challengeId:string,DayReport:IUserDayReport):Promise<IUserWeeklyChallenge>;
}