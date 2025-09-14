import { HttpResponse } from "@/constants/response-message.constant";
import { HttpStatus } from "@/constants/status.constant";
import { IClientPersonalizationController } from "@/core/interface/controllers/client/IClient.Personalization.Controller";
import { IClientPersonalizationService } from "@/core/interface/services/client/IClient.Personalization.Service";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { Response, NextFunction } from "express";
import { 
  ClientPersonalizationDTO,
  GeneratePersonalizationRequestDTO,
} from '@/dtos/reverse-mapping/client/ClientPersonalizationDTO';
import { ControllerErrorHandler } from '@/utils/controller-error-handler.util';

export class ClientPersonalizationController
  implements IClientPersonalizationController
{
  constructor(
    private readonly _personalizationServices: IClientPersonalizationService
  ) {}

  async generatePersonalization(
    req: AddedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Validate and transform request body using DTO
      const validatedBody: GeneratePersonalizationRequestDTO = ClientPersonalizationDTO.validateGeneratePersonalizationRequest(req.body);
      
      const userId = req.user?.id;
      await this._personalizationServices.generatePersonalization(
        userId,
        validatedBody
      );
      
      ControllerErrorHandler.handleSuccess(res, null, HttpResponse.GENERATING_FITNESS_PLAN_SUCCESSFULL, HttpStatus.CREATED);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getWorkoutDetails(
    req: AddedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      const workoutDetails = await this._personalizationServices.getWorkoutDetails(userId);
      
      ControllerErrorHandler.handleSuccess(res, { workoutDetails }, HttpResponse.DATA_FETCHING_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getProfileData(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const profileData = await this._personalizationServices.getProfileData(userId);
      
      ControllerErrorHandler.handleSuccess(res, { data: profileData }, HttpResponse.DATA_FETCHING_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }    
  }

  async updateClientProfile(req:AddedRequest, res:Response, next:NextFunction):Promise<void>{
    try {
      // Validate and transform request body using DTO
      const validatedBody = ClientPersonalizationDTO.validateUpdateClientProfileRequest(req.body);
      
      const userId = req.user.id;
      await this._personalizationServices.updateClientProfile(userId, validatedBody);
      
      ControllerErrorHandler.handleSuccess(res, null, HttpResponse.PROFILE_DATA_UPDATION_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

}