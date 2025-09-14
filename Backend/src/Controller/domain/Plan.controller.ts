import { IPlanController } from '@/core/interface/controllers/domain/IPlan.Controller';
import { IPlanService } from '@/core/interface/services/domain/IPlan.Service';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { IPlan } from '@/core/interface/model/IPlan';
import { 
  PlanDTO,
  CreatePlanRequestDTO,
  GetPlansByTrainerRequestDTO,
  UpdatePlanRequestDTO,
  DeactivatePlanRequestDTO
} from '@/dtos/reverse-mapping/domain/PlanDTO';
import { ControllerErrorHandler } from '@/utils/controller-error-handler.util';

export class PlanController implements IPlanController {

  constructor(
    private readonly _planService: IPlanService,
  ) {}

  async createPlan(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate and transform request body using DTO
      const validatedBody: CreatePlanRequestDTO = PlanDTO.validateCreatePlanRequest(req.body);
      
      const plan: Partial<IPlan> = {
        trainerId: new Types.ObjectId(validatedBody.trainerId),
        title: validatedBody.title,
        description: validatedBody.description,
        price: validatedBody.price,
        sessionsPerWeek: validatedBody.sessionsPerWeek,
        durationWeeks: validatedBody.durationWeeks,
        isActive: validatedBody.isActive ?? true,
        isBooked: validatedBody.isBooked ?? false,
      };
      
      await this._planService.createPlan(plan as IPlan);
      
      ControllerErrorHandler.handleSuccess(res, null, "Plan created successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  };

  async getPlansByTrainer(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate and transform request query using DTO
      const validatedQuery: GetPlansByTrainerRequestDTO = PlanDTO.validateGetPlansByTrainerRequest(req.query);
      
      const plans = await this._planService.getPlansByTrainer(validatedQuery.trainerId);
      
      ControllerErrorHandler.handleSuccess(res, plans, "Plans retrieved successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  };
  
  async updatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate and transform request body using DTO
      const validatedBody: UpdatePlanRequestDTO = PlanDTO.validateUpdatePlanRequest(req.body);
      
      await this._planService.updatePlan(validatedBody.editingPlanId, validatedBody.formData);
      
      ControllerErrorHandler.handleSuccess(res, null, "Plan updated successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  };

  async deactivatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate and transform request body using DTO
      const validatedBody: DeactivatePlanRequestDTO = PlanDTO.validateDeactivatePlanRequest(req.body);
      
      await this._planService.deactivatePlan(validatedBody.editingPlanId);
      
      ControllerErrorHandler.handleSuccess(res, null, "Plan deactivated successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  };

}