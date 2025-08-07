import { HttpResponse } from "@/constants/response-message.constant";
import { HttpStatus } from "@/constants/status.constant";
import { IClientWorkoutPlanController } from "@/core/interface/controllers/client/IClient.WorkoutPlan.Controller";
import { IClientWorkoutPlanService } from "@/core/interface/services/client/IClient.WorkoutPlan.Service";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import logger from "@/utils/logger.utils";
import { NextFunction, Response } from "express";


export class ClientWorkoutPlanController
  implements IClientWorkoutPlanController
{
  constructor(
    private readonly _workoutPlanServices: IClientWorkoutPlanService,
  ) {}
  /** Reserved for Diet plan specific methods */
  _placeholder?: never;
  
  async getWorkouts(req:AddedRequest, res:Response, next:NextFunction){
    try {
        logger.info('enterd to get workouts');
        const userId = req.user?.id;
        const week = req.params.week;
        const workouts = await this._workoutPlanServices.getWorkouts(userId,week);
        res.status(HttpStatus.OK).json({message:HttpResponse.WORKOUTS_FETCHED_SUCCESSFULL,workouts:workouts});
    } catch (error) {
        next(error);
    }
  }

  async completeDailyWorkoutAndFetchReport(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const { week, day, workout } = req.body;
      const userId = req.user?.id;
      const report = await this._workoutPlanServices.completeDailyWorkoutAndFetchReport(userId,week,day,workout);
      res.status(HttpStatus.OK).json({message:HttpResponse.WORKOUT_STATUS_UPDATED_SUCCESSFULL,data:report});
    } catch (error) {
      next(error);
    }
  }

}
