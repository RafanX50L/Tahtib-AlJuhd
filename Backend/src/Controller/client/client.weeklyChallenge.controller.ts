import { HttpResponse } from "@/constants/response-message.constant";
import { IClientWeeklyChallengeController } from "@/core/interface/controllers/client/IClient.WeeklyChallenge.Controller";
import { IClientWeeklyChallengeService } from "@/core/interface/services/client/IClient.WeeklyChallenge.service";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { NextFunction, Request, Response } from "express";
import { 
  ClientWeeklyChallengeDTO,
  GetWeeklyChallengeByIdRequestDTO,
  JoinWeeklyChallengeRequestDTO,
  MarkChallengeDayCompleteRequestDTO
} from '@/dtos/reverse-mapping/client/ClientWeeklyChallengeDTO';
import { ControllerErrorHandler } from '@/utils/controller-error-handler.util';

export class ClientWeeklyChallengeController implements IClientWeeklyChallengeController{
    constructor(
        private readonly _weeklyChallengeService: IClientWeeklyChallengeService
    ){}
    /** Reserved for Weekly Challenge specific methods */
    _placeholder?: never;

    async getWeeklyChallenges(req: Request, res: Response, next: NextFunction){
        try {
            const weeklyChallenges = await this._weeklyChallengeService.getWeeklyChallenges();
            
            ControllerErrorHandler.handleSuccess(res, { weeklyChallenges }, HttpResponse.WEEKLY_CHALLENGES_FETCHED);
        } catch (error) {
            ControllerErrorHandler.handleError(error, res, next);
        }
    }

    async getWeeklyChallengeById(req: AddedRequest, res: Response, next: NextFunction){
        try {
            // Validate and transform request parameters using DTO
            const validatedParams: GetWeeklyChallengeByIdRequestDTO = ClientWeeklyChallengeDTO.validateGetWeeklyChallengeByIdRequest(req.params);
            
            const userId = req.user.id;
            const weeklyChallenge = await this._weeklyChallengeService.getWeeklyChallengeById(validatedParams.id, userId);
            
            ControllerErrorHandler.handleSuccess(res, { challenge: weeklyChallenge }, HttpResponse.WEEKLY_CHALLENGES_FETCHED);
        } catch (error) {
            ControllerErrorHandler.handleError(error, res, next);
        }
    }

    async joinWeeklyChallenge(req: AddedRequest, res: Response, next: NextFunction) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams: JoinWeeklyChallengeRequestDTO = ClientWeeklyChallengeDTO.validateJoinWeeklyChallengeRequest(req.params);
            
            const userId = req.user?.id;
            await this._weeklyChallengeService.joinWeeklyChallenge(userId, validatedParams.id);
            
            ControllerErrorHandler.handleSuccess(res, null, HttpResponse.WEEKLY_CHALLENGE_JOINED_SUCCESSFULL, 201);
        } catch (error) {
            ControllerErrorHandler.handleError(error, res, next);
        }
    }

    async markChallengeDayComplete(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate and transform request parameters and body using DTOs
            const validatedParams: MarkChallengeDayCompleteRequestDTO = ClientWeeklyChallengeDTO.validateMarkChallengeDayCompleteRequest(req.params, req.body);
            
            const userId = req.user.id;
            const report = await this._weeklyChallengeService.markChallengeDayComplete(
                userId,
                validatedParams.exercises,
                validatedParams.challengeId,
                Number(validatedParams.dayNumber)
            );
            
            ControllerErrorHandler.handleSuccess(res, { data: report }, HttpResponse.MARK_CHALLENGE_DAY_COMPLETED_SUCCESSFULL);
        } catch (error) {
            ControllerErrorHandler.handleError(error, res, next);
        }
    }
}