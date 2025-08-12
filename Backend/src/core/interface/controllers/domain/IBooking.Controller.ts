import { NextFunction, Request, Response } from "express";

export interface IBookingController {
  purchasePlan(req: Request, res: Response, next: NextFunction): Promise<void>;
  bookSlot(req: Request, res: Response, next: NextFunction): Promise<void>;
  cancelSession(req: Request, res: Response, next: NextFunction): Promise<void>;
}