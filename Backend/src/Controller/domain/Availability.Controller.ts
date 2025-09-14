import { IAvailabilityController } from '@/core/interface/controllers/domain/IAvailability.Controller';
import { IAvailabilityService } from '@/core/interface/services/domain/IAvailability.Service';
import { AddedRequest } from '@/middleware/verify.token.middleware';
import { NextFunction, Request, Response } from 'express';
import { 
  AvailabilityDTO,
  GetFreeSlotsRequestDTO,
  GetUnFreeSlotsRequestDTO,
  SetWeeklyRulesRequestDTO,
  GetWeeklyRulesRequestDTO
} from '@/dtos/reverse-mapping/domain/AvailabilityDTO';
import { ControllerErrorHandler } from '@/utils/controller-error-handler.util';

export class AvailabilityController implements IAvailabilityController {

  constructor(
    private readonly _availabilityService: IAvailabilityService
  ) {}

  async getFreeSlots (req: Request, res: Response, next: NextFunction) {
    try {
      // Validate and transform request query using DTO
      const validatedQuery: GetFreeSlotsRequestDTO = AvailabilityDTO.validateGetFreeSlotsRequest(req.query);
      
      const slots = await this._availabilityService.getFreeSlots(
        validatedQuery.trainerId, 
        new Date(validatedQuery.fromDate), 
        new Date(validatedQuery.toDate)
      );
      
      ControllerErrorHandler.handleSuccess(res, slots, "Free slots retrieved successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  };
  async getUnFreeSlots (req: AddedRequest, res: Response, next: NextFunction) {
    try {
      // Validate and transform request query using DTO
      const validatedQuery: GetUnFreeSlotsRequestDTO = AvailabilityDTO.validateGetUnFreeSlotsRequest(req.query);
      
      const role = req.user?.role;
      let slots;
      
      if(role === "client"){
        slots = await this._availabilityService.getUnFreeSlotsByClient(
          req.user.id as string, 
          new Date(validatedQuery.fromDate), 
          new Date(validatedQuery.toDate)
        );
      } else if(role === "trainer"){
        slots = await this._availabilityService.getUnFreeSlotsByTrainer(
          validatedQuery.trainerId, 
          new Date(validatedQuery.fromDate), 
          new Date(validatedQuery.toDate)
        );
      }
      
      ControllerErrorHandler.handleSuccess(res, slots, "Unfree slots retrieved successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  };
  async setWeeklyRules (req: Request, res: Response, next: NextFunction) {
    try {
      // Validate and transform request body using DTO
      const validatedBody: SetWeeklyRulesRequestDTO = AvailabilityDTO.validateSetWeeklyRulesRequest(req.body);
      
      await this._availabilityService.setWeeklyRules(validatedBody.trainerId, validatedBody.rules);
      
      ControllerErrorHandler.handleSuccess(res, null, "Weekly rules saved successfully");
    } catch (err) { 
      ControllerErrorHandler.handleError(err, res, next);
    }
  };
  
  async getWeeklyRules (req: Request, res: Response, next: NextFunction) {
    try {
      // Validate and transform request query using DTO
      const validatedQuery: GetWeeklyRulesRequestDTO = AvailabilityDTO.validateGetWeeklyRulesRequest(req.query);
      
      const rules = await this._availabilityService.getWeeklyRules(validatedQuery.trainerId);
      
      ControllerErrorHandler.handleSuccess(res, rules, "Weekly rules retrieved successfully");
    } catch (err) { 
      ControllerErrorHandler.handleError(err, res, next);
    }
  }

}