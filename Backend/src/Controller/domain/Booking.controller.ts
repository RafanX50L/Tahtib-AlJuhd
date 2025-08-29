import { HttpStatus } from '@/constants/status.constant';
import { IBookingController } from '@/core/interface/controllers/domain/IBooking.Controller';
import { IBookingService } from '@/core/interface/services/domain/IBooking.Service';
import { NextFunction, Request, Response } from 'express';

export class BookingController implements IBookingController {

  constructor(
    private readonly _bookingService: IBookingService,
  ) {}

  async purchasePlan (req: Request, res: Response, next: NextFunction) {
    try {
      const { clientId, trainerId, planId } = req.body;
      const contract = await this._bookingService.purchasePlan(clientId, trainerId, planId);
      res.status(HttpStatus.OK).json(contract);
    } catch (err) {
      next(err);
    }
  };
}