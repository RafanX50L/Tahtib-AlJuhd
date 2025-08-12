import { HttpStatus } from '@/constants/status.constant';
import { IBookingService } from '@/core/interface/services/domain/IBooking.Service';
import { NextFunction, Request, Response } from 'express';

export class BookingController {

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

  async bookSlot (req: Request, res: Response, next: NextFunction) {
    try {
      const { clientId, sessionId } = req.body;
      const session = await this._bookingService.bookSlot(clientId, sessionId);
      res.status(HttpStatus.OK).json(session);
    } catch (err) {
      next(err);
    }
  };

  async cancelSession (req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      const session = await this._bookingService.cancelSession(sessionId);
      res.status(HttpStatus.OK).json(session);
    } catch (err) {
      next(err);
    }
  };
}