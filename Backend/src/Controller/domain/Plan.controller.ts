import { HttpStatus } from '@/constants/status.constant';
import { IPlanController } from '@/core/interface/controllers/domain/IPlan.Controller';
import { IPlanService } from '@/core/interface/services/domain/IPlan.Service';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';

export class PlanController implements IPlanController {

  constructor(
    private readonly _planService: IPlanService,
  ) {}

  async createPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = req.body;
      plan.trainerId = new Types.ObjectId(plan.trainerId);
      const newPlan = await this._planService.createPlan(plan);
      res.status(HttpStatus.OK).json(newPlan);
    } catch (err) {
      next(err);
    }
  };

  async getPlansByTrainer(req: Request, res: Response, next: NextFunction) {
    try {
      const trainerId = req.query.trainerId as string;
      const plans = await this._planService.getPlansByTrainer(trainerId);
      res.status(HttpStatus.OK).json(plans);
    } catch (err) {
      next(err);
    }
  };
  async updatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const {editingPlanId,formData} = req.body;
      const updatedPlan = await this._planService.updatePlan(editingPlanId,formData);
      res.status(HttpStatus.OK).json(updatedPlan);
    } catch (err) {
      next(err);
    }
  };

  async deactivatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const {editingPlanId} = req.body;
      const updatedPlan = await this._planService.deactivatePlan(editingPlanId);
      res.status(HttpStatus.OK).json(updatedPlan);
    } catch (err) {
      next(err);
    }
  };

}