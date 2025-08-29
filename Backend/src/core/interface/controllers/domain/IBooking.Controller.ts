import { NextFunction, Request, Response } from "express";

export interface IBookingController {
  purchasePlan(req: Request, res: Response, next: NextFunction): Promise<void>;
}