import { IWeeklyChallenge } from "@/core/interface/model/IWeeklyChallenge.models";
import { BaseRepository } from "./base.repository";
import { WeeklyChallengeModel } from "@/models/WeeklyChallenge.model";
import { IWeeklyChallengeRepository } from "@/core/interface/repositories/IWeeklyChallenge.repository";

export class WeeklyChallengeRepository extends BaseRepository<IWeeklyChallenge> implements IWeeklyChallengeRepository{
    constructor(){
        super(WeeklyChallengeModel);
    }
}