import { HttpStatus } from '@/constants/status.constant';
import { IAvailabilityController } from '@/core/interface/controllers/domain/IAvailability.Controller';
import { IAvailabilityService } from '@/core/interface/services/domain/IAvailability.Service';
import { AddedRequest } from '@/middleware/verify.token.middleware';
import { NextFunction, Request, Response } from 'express';

export class AvailabilityController implements IAvailabilityController {

  constructor(
    private readonly _availabilityService: IAvailabilityService
  ) {}

  async getFreeSlots (req: Request, res: Response, next: NextFunction) {
    try {
      const { trainerId, fromDate, toDate } = req.query;
      const slots = await this._availabilityService.getFreeSlots(trainerId as string, new Date(fromDate as string), new Date(toDate as string));
      console.log("slots",slots);
      res.status(HttpStatus.OK).json(slots);
    } catch (err) {
      next(err);
    }
  };
  async getUnFreeSlots (req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const { trainerId, fromDate, toDate } = req.query;
      const role = req.user?.role;
      let slots ;
      if(role === "client"){
        console.log("client");
        slots = await this._availabilityService.getUnFreeSlotsByClient(req.user.id as string, new Date(fromDate as string), new Date(toDate as string));

      }else if(role === "trainer"){
        slots = await this._availabilityService.getUnFreeSlotsByTrainer(trainerId as string, new Date(fromDate as string), new Date(toDate as string));
      }
      console.log("slots",slots);
      res.status(HttpStatus.OK).json(slots);
    } catch (err) {
      next(err);
    }
  };
  async setWeeklyRules (req: Request, res: Response, next: NextFunction) {
    try {
      const { trainerId, rules } = req.body;
      await this._availabilityService.setWeeklyRules(trainerId, rules);
      res.json({ message: 'Weekly rules saved' });
    } catch (err) { next(err); }
  };
  async getWeeklyRules (req: Request, res: Response, next: NextFunction) {
  try {
    const { trainerId } = req.query as { trainerId?: string };
    if (!trainerId) return res.status(400).json({ error: 'trainerId is required' });
    const rules = await this._availabilityService.getWeeklyRules(trainerId) ;
    res.status(HttpStatus.OK).json(rules);
  } catch (err) { next(err); }
}

}