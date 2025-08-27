import { NextFunction, Request, Response } from "express";

export interface IAvailabilityController {
  setAvailability(req: Request, res: Response, next: NextFunction): Promise<void>;
  getFreeSlots(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUnFreeSlots (req: Request, res: Response, next: NextFunction): Promise<void>;
}
