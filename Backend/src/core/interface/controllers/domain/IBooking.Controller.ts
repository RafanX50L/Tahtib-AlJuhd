import { NextFunction, Request, Response } from "express";

export interface IBookingController {
  // purchasePlan(req: Request, res: Response, next: NextFunction): Promise<void>;
  checkOutSessionHandle(req: Request, res: Response, next: NextFunction): Promise<void>;
  handlePaymentSucess(req: Request, res: Response, next: NextFunction): Promise<void>;
}