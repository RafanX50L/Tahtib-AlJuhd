import { AddedRequest } from "@/middleware/verify.token.middleware";
import { NextFunction, Response } from "express";

export interface ITrainerScheduleController {
  createSchedule(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
  updateSchedule(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
  getSchedule(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
  getAvailableSlots(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
  toggleScheduleActive(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
}
