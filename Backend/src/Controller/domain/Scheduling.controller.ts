import { ISchedulingController } from "@/core/interface/controllers/domain/IScheduling.Controller";
import { ISchedulingService } from "@/core/interface/services/domain/IScheduling.Service";
import { NextFunction, Request, Response } from "express";

export class SchedulingController implements ISchedulingController {
  constructor(private readonly _schedulingService: ISchedulingService) {}
  async getAvailabilityForDate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { trainerId } = req.params;
      const { date, tz } = req.query as { date?: string; tz?: string };
      const result = await this._schedulingService.getAvailabilityForDate(
        trainerId,
        date,
        tz
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
  async bookSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const { trainerId, clientId, date, time, duration, tz, contractId } =
        req.body as {
          trainerId: string;
          clientId: string;
          date: string;
          time: string;
          duration?: number;
          tz?: string;
          contractId: string;
        };
      console.log(req.body);
      const booking = await this._schedulingService.bookSlot({
        trainerId,
        clientId,
        date,
        time,
        duration: duration || 60,
        tz,
        contractId,
      });
      res.status(201).json(booking);
    } catch (err) {
      next(err);
    }
  }
  async listBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const { trainerId, clientId, status } = req.query as {
        trainerId?: string;
        clientId?: string;
        status?: string;
      };
      const items = await this._schedulingService.listBookings({
        trainerId,
        clientId,
        status,
      });
      res.json(items);
    } catch (err) {
      next(err);
    }
  }
  async cancelBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId } = req.params;
      const { clientId } = req.body;
      const canceled = await this._schedulingService.cancelBooking(
        bookingId,
        clientId
      );
      res.json(canceled);
    } catch (err) {
      next(err);
    }
  }
  async completeBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId } = req.params;
      await this._schedulingService.completeBooking(bookingId);
      res.json("Session completed marked successfully");
    } catch (err) {
      next(err);
    }
  }
}
