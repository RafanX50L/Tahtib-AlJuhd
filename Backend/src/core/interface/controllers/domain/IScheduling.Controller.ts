import { NextFunction, Request, Response } from "express";

export interface ISchedulingController {
    getAvailabilityForDate (req: Request, res: Response, next: NextFunction): Promise<void>;
    bookSlot (req: Request, res: Response, next: NextFunction): Promise<void>;
    cancelBooking (req: Request, res: Response, next: NextFunction): Promise<void>;
    completeBooking (req: Request, res: Response, next: NextFunction): Promise<void>;
}