import { HttpResponse } from "@/constants/response-message.constant";
import { ITrainerPersonalizationController } from "@/core/interface/controllers/trainer/ITrainer.Personalization.Controller";
import { ITrainerPersonalizationService } from "@/core/interface/services/trainer/ITrainer.Personalization.Service";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import logger from "@/utils/logger.utils";
import { NextFunction, Response } from "express";
import { 
  TrainerPersonalizationDTO,
  UpdateProfileDataRequestDTO
} from '@/dtos/reverse-mapping/trainer/TrainerPersonalizationDTO';
import { ControllerErrorHandler } from '@/utils/controller-error-handler.util';

export class TrainerPersonalizationController
  implements ITrainerPersonalizationController
{
  constructor(
    private readonly _personalizationService: ITrainerPersonalizationService
  ) {}
  _private: never;

  async submitApplication(
    req: AddedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user.id;
      await this._personalizationService.submitApplication(userId, req);
      
      ControllerErrorHandler.handleSuccess(res, null, HttpResponse.APPLICATION_SUBMISSION_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getPendingApplicationDetails(
    req: AddedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info('entered to fetch details');
      const userId = req.user?.id;
      const data = await this._personalizationService.getPendingApplicationDetails(userId);
      
      ControllerErrorHandler.handleSuccess(res, data, HttpResponse.DATA_FETCHING_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getProfileData(req:AddedRequest, res:Response, next:NextFunction):Promise<void>{
    try {
      const userId = req.user.id;
      const result = await this._personalizationService.getTrainerProfile(userId);
      
      ControllerErrorHandler.handleSuccess(res, result, HttpResponse.DATA_FETCHING_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async updateProfileData(req:AddedRequest, res:Response, next:NextFunction):Promise<void>{
    try {
      // Validate and transform request body using DTO
      const validatedBody: UpdateProfileDataRequestDTO = TrainerPersonalizationDTO.validateUpdateProfileDataRequest(req.body);
      
      const userId = req.user.id;
      await this._personalizationService.updateProfileData(userId, validatedBody);
      
      ControllerErrorHandler.handleSuccess(res, null, HttpResponse.PROFILE_DATA_UPDATION_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getSalary(req:AddedRequest, res:Response, next:NextFunction):Promise<void>{
    try {
      const userId = req.user.id;
      const salary = await this._personalizationService.getSalary(userId);
      
      ControllerErrorHandler.handleSuccess(res, { salary }, HttpResponse.DATA_FETCHING_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

}
