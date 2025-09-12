import { NextFunction, Request, Response } from "express";

export interface IAvailabilityController {
  getFreeSlots(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUnFreeSlots (req: Request, res: Response, next: NextFunction): Promise<void>;
  setWeeklyRules (req: Request, res: Response, next: NextFunction): Promise<void>;
  getWeeklyRules (req: Request, res: Response, next: NextFunction);
}
