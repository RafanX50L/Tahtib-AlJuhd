import { NextFunction, Request, Response } from "express";

export interface IPaymentController {
  getAllPayments(req: Request, res: Response, next:NextFunction): Promise<void>;
  getPaymentsByClient(req: Request, res: Response, next:NextFunction): Promise<void>;
  getPaymentsByTrainer(req: Request, res: Response, next:NextFunction): Promise<void>;
  getPaymentById(req: Request, res: Response, next:NextFunction): Promise<void>;
  getPaymentsByDateRange(req: Request, res: Response, next:NextFunction): Promise<void>;
  getTotalRevenue(req: Request, res: Response, next:NextFunction): Promise<void>;
  getTotalRevenueByTrainer(req: Request, res: Response, next:NextFunction): Promise<void>;
  updatePaymentStatus(req: Request, res: Response, next:NextFunction): Promise<void>;
  getPaymentByStripePaymentIntentId(req: Request, res: Response, next:NextFunction): Promise<void>;
  getPaymentByStripeSessionId(req: Request, res: Response, next:NextFunction): Promise<void>;
}
