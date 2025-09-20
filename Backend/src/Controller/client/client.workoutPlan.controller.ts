import { HttpResponse } from "@/constants/response-message.constant";
import { IClientWorkoutPlanController } from "@/core/interface/controllers/client/IClient.WorkoutPlan.Controller";
import { IClientWorkoutPlanService } from "@/core/interface/services/client/IClient.WorkoutPlan.Service";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import logger from "@/utils/logger.utils";
import { NextFunction, Response } from "express";
import { 
  ClientWorkoutPlanDTO,
  GetWorkoutsRequestDTO,
  CompleteDailyWorkoutRequestDTO,
  GetWorkoutReportRequestDTO
} from '@/dtos/reverse-mapping/client/ClientWorkoutPlanDTO';
import { ControllerErrorHandler } from '@/utils/controller-error-handler.util';


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
        logger.info('entered to get workouts');
        
        // Validate and transform request parameters using DTO
        const validatedParams: GetWorkoutsRequestDTO = ClientWorkoutPlanDTO.validateGetWorkoutsRequest(req.params);
        
        const userId = req.user?.id;
        const workouts = await this._workoutPlanServices.getWorkouts(userId, validatedParams.week);
        
        ControllerErrorHandler.handleSuccess(res, { workouts }, HttpResponse.WORKOUTS_FETCHED_SUCCESSFULL);
    } catch (error) {
        ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async completeDailyWorkoutAndFetchReport(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      // Validate and transform request body using DTO
      const validatedBody: CompleteDailyWorkoutRequestDTO = ClientWorkoutPlanDTO.validateCompleteDailyWorkoutRequest(req.body);
      
      const userId = req.user?.id;
      const report = await this._workoutPlanServices.completeDailyWorkoutAndFetchReport(
        userId,
        validatedBody.week,
        validatedBody.day,
        validatedBody.workout
      );
      
      ControllerErrorHandler.handleSuccess(res, { data: report }, HttpResponse.WORKOUT_STATUS_UPDATED_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getWorkoutReport(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      // Validate and transform request query using DTO
      const validatedQuery: GetWorkoutReportRequestDTO = ClientWorkoutPlanDTO.validateGetWorkoutReportRequest(req.query);
      
      const userId = req.user?.id;
      const report = await this._workoutPlanServices.getWorkoutReport(
        userId,
        validatedQuery.week,
        validatedQuery.day
      );
      
      ControllerErrorHandler.handleSuccess(res, { report }, HttpResponse.DATA_FETCHING_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

}
