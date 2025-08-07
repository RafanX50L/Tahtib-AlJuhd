import { HttpResponse } from "@/constants/response-message.constant";
import { HttpStatus } from "@/constants/status.constant";
import { IClientPersonalizationController } from "@/core/interface/controllers/client/IClient.Personalization.Controller";
import { IClientPersonalizationService } from "@/core/interface/services/client/IClient.Personalization.Service";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { Response, NextFunction } from "express";

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
      const clientPersonalizationData = req.body;
      const userId = req.user?.id;
      await this._personalizationServices.generatePersonalization(
        userId,
        clientPersonalizationData
      );
      res.status(HttpStatus.CREATED).json({
        message: HttpResponse.GENERATING_FITNESS_PLAN_SUCCESSFULL,
      });
    } catch (error) {
      next(error);
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
      res.status(HttpStatus.OK).json({message:HttpResponse.DATA_FETCHING_SUCCESSFULL,workoutDetails:workoutDetails});
    } catch (error) {
      next(error);
    }
  }

  async getProfileData(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const profileData = await this._personalizationServices.getProfileData(userId);
      res.status(HttpStatus.OK).json({message:HttpResponse.DATA_FETCHING_SUCCESSFULL, data:profileData});
    } catch (error) {
      next(error);
    }    
  }

  async updateClientProfile(req:AddedRequest, res:Response, next:NextFunction):Promise<void>{
    try {
      const userId = req.user.id;
      const formdata = req.body;
      console.log(req.body);
      await this._personalizationServices.updateClientProfile(userId,formdata);
      res.status(HttpStatus.OK).json( {success:true,message: HttpResponse.PROFILE_DATA_UPDATION_SUCCESSFULL});
    } catch (error) {
      next(error);
    }
  }

}