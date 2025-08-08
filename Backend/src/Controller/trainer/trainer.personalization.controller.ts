import { HttpResponse } from "@/constants/response-message.constant";
import { HttpStatus } from "@/constants/status.constant";
import { ITrainerPersonalizationController } from "@/core/interface/controllers/trainer/ITrainer.Personalization.Controller";
import { ITrainerPersonalizationService } from "@/core/interface/services/trainer/ITrainer.Personalization.Service";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import logger from "@/utils/logger.utils";
import { NextFunction, Response } from "express";

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
      console.log("nice one");
      await this._personalizationService.submitApplication(userId, req);
      console.log("nice one1");
      res
        .status(HttpStatus.OK)
        .json({ message: HttpResponse.APPLICATION_SUBMISSION_SUCCESSFULL });
    } catch (error) {
      next(error);
    }
  }

  async getPendingApplicationDetails(
    req: AddedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info('enterd to fetch details');
      const userId = req.user?.id;
      const data = await this._personalizationService.getPendingApplicationDetails(userId);
      res.status(HttpStatus.OK).json({message:HttpResponse.DATA_FETCHING_SUCCESSFULL,data:data});
    } catch (error) {
      next(error);
    }
  }

  async getProfileData(req:AddedRequest, res:Response, next:NextFunction):Promise<void>{
    try {
      const userId = req.user.id;
      const result = await this._personalizationService.getTrainerProfile(userId);
      console.log('result',result);
      res.status(HttpStatus.OK).json({message:HttpResponse.DATA_FETCHING_SUCCESSFULL,data:result});
    } catch (error) {
      next(error);
    }
  }

  async updateProfileData(req:AddedRequest, res:Response, next:NextFunction):Promise<void>{
    try {
      const data = req.body;
      const userId = req.user.id;
      console.log(data);
      await this._personalizationService.updateProfileData(userId,data);
      res.status(HttpStatus.OK).json({message:HttpResponse.PROFILE_DATA_UPDATION_SUCCESSFULL});
    } catch (error) {
      next(error);
    }
  }

}
