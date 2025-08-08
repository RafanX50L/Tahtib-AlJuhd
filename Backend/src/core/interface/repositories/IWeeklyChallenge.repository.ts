import { IWeeklyChallenge } from "../model/IWeeklyChallenge.models";
import { IBaseRepository } from "./IBase.repository";

export interface IWeeklyChallengeRepository
  extends IBaseRepository<IWeeklyChallenge> {
  /** Reserved for Weekly Challenge specific methods */
  _placeholder?: never;
  
}
