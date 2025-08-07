import { HttpResponse } from "@/constants/response-message.constant";
import { HttpStatus } from "@/constants/status.constant";
import { IClientWeeklyChallengeController } from "@/core/interface/controllers/client/IClient.WeeklyChallenge.Controller";
import { IClientWeeklyChallengeService } from "@/core/interface/services/client/IClient.WeeklyChallenge.service";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { NextFunction, Request, Response } from "express";

export class ClientWeeklyChallengeController implements IClientWeeklyChallengeController{
    constructor(
        private readonly _weeklyChallengeService: IClientWeeklyChallengeService
    ){}
    /** Reserved for Weekly Challenge specific methods */
    _placeholder?: never;

    async getWeeklyChallenges(req: Request, res: Response, next: NextFunction){
        try {
            const weeklyChallenges = await this._weeklyChallengeService.getWeeklyChallenges();
            res.status(HttpStatus.OK).json({message:HttpResponse.WEEKLY_CHALLENGES_FETCHED,weeklyChallenges:weeklyChallenges});
        } catch (error) {
            next(error);
        }
    }

    async getWeeklyChallengeById(req: AddedRequest, res: Response, next: NextFunction){
        try {
            const id = req.params.id;
            const userId = req.user.id;
            const weeklyChallenge = await this._weeklyChallengeService.getWeeklyChallengeById(id,userId);
            res.status(HttpStatus.OK).json({message:HttpResponse.WEEKLY_CHALLENGES_FETCHED,challenge:weeklyChallenge});
        } catch (error) {
            next(error);
        }
    }

    async joinWeeklyChallenge(req: AddedRequest, res: Response, next: NextFunction) {
        try {
            const challengeId = req.params.id;
            const userId = req.user?.id;
            await this._weeklyChallengeService.joinWeeklyChallenge(userId,challengeId);
            res.status(HttpStatus.CREATED).json({message:HttpResponse.WEEKLY_CHALLENGE_JOINED_SUCCESSFULL});
        } catch (error) {
            next(error);
        }
    }

    async markChallengeDayComplete(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user.id;
            const { challengeId,dayNumber} =  req.params;
            const exercises = req.body.exercises;
            const report = await this._weeklyChallengeService.markChallengeDayComplete(userId,exercises,challengeId,Number(dayNumber));
            res.status(HttpStatus.OK).json({message:HttpResponse.MARK_CHALLENGE_DAY_COMPLETED_SUCCESSFULL,data:report});
        } catch (error) {
            next(error);
        }
    }
}