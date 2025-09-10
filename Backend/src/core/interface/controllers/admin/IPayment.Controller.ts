import { Request, Response } from "express";
import { IPaymentView } from "@/dtos/domain/PaymentDTO";

export interface IPaymentController {
  getAllPayments(req: Request, res: Response): Promise<void>;
  getPaymentsByClient(req: Request, res: Response): Promise<void>;
  getPaymentsByTrainer(req: Request, res: Response): Promise<void>;
  getPaymentById(req: Request, res: Response): Promise<void>;
  getPaymentsByDateRange(req: Request, res: Response): Promise<void>;
  getTotalRevenue(req: Request, res: Response): Promise<void>;
  getTotalRevenueByTrainer(req: Request, res: Response): Promise<void>;
  updatePaymentStatus(req: Request, res: Response): Promise<void>;
  getPaymentByStripePaymentIntentId(req: Request, res: Response): Promise<void>;
  getPaymentByStripeSessionId(req: Request, res: Response): Promise<void>;
}
