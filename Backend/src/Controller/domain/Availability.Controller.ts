import { HttpStatus } from '@/constants/status.constant';
import { IAvailabilityController } from '@/core/interface/controllers/domain/IAvailability.Controller';
import { IAvailabilityService } from '@/core/interface/services/domain/IAvailability.Service';
import { NextFunction, Request, Response } from 'express';

export class AvailabilityController implements IAvailabilityController {

  constructor(
    private readonly _availabilityService: IAvailabilityService
  ) {}

  async setAvailability  (req: Request, res: Response, next: NextFunction)  {
    try {
      const { trainerId, slots } = req.body;
      console.log(req.body);
      await this._availabilityService.setAvailability(trainerId, slots);
      res.status(HttpStatus.OK).json({ message: 'Availability set and slots generated' });
    } catch (err) {
      next(err);
    }
  };

  async getFreeSlots (req: Request, res: Response, next: NextFunction) {
    try {
      const { trainerId, fromDate, toDate } = req.query;
      const mode = (req.query.mode as string) || 'free';
      const from = new Date(fromDate as string);
      const to = new Date(toDate as string);
      const slots = mode === 'all'
        ? await (this._availabilityService as any).getAllSlots(trainerId as string, from, to)
        : await this._availabilityService.getFreeSlots(trainerId as string, from, to);
      console.log("slots",slots);
      res.status(HttpStatus.OK).json(slots);
    } catch (err) {
      next(err);
    }
  };
  async getUnFreeSlots (req: Request, res: Response, next: NextFunction) {
    try {
      const { trainerId, fromDate, toDate } = req.query;
      const slots = await this._availabilityService.getUnFreeSlots(trainerId as string, new Date(fromDate as string), new Date(toDate as string));
      console.log("slots",slots);
      res.status(HttpStatus.OK).json(slots);
    } catch (err) {
      next(err);
    }
  };
}