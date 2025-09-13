import { NextFunction, Request, Response } from "express";
import { IPaymentController } from "@/core/interface/controllers/admin/IPayment.Controller";
import { IPaymentService } from "@/core/interface/services/domain/IPayment.Service";
import { createHttpError } from "@/utils";
import { HttpStatus } from "@/constants/status.constant";

export class PaymentController implements IPaymentController {
  constructor(
    private readonly _paymentService: IPaymentService
  ) {}

  async getAllPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payments = await this._paymentService.getAllPayments();
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Payments retrieved successfully",
        data: payments,
      });
    } catch (error) {
      next(error);
      throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve payments");
    }
  }

  async getPaymentsByClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { clientId } = req.params;
      if (!clientId) {
        throw createHttpError(HttpStatus.BAD_REQUEST, "Client ID is required");
      }

      const payments = await this._paymentService.getPaymentsByClient(clientId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Client payments retrieved successfully",
        data: payments,
      });
    } catch (error) {
      next(error);
      throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve client payments");
    }
  }

  async getPaymentsByTrainer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { trainerId } = req.params;
      if (!trainerId) {
        throw createHttpError(HttpStatus.BAD_REQUEST, "Trainer ID is required");
      }

      const payments = await this._paymentService.getPaymentsByTrainer(trainerId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Trainer payments retrieved successfully",
        data: payments,
      });
    } catch (error) {
      next(error);
      throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve trainer payments");
    }
  }

  async getPaymentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { paymentId } = req.params;
      if (!paymentId) {
        throw createHttpError(HttpStatus.BAD_REQUEST, "Payment ID is required");
      }

      const payment = await this._paymentService.getPaymentById(paymentId);
      if (!payment) {
        throw createHttpError(HttpStatus.NOT_FOUND, "Payment not found");
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Payment retrieved successfully",
        data: payment,
      });
    } catch (error) {
      next(error);
      throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve payment");
    }
  }

  async getPaymentsByDateRange(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        throw createHttpError(HttpStatus.BAD_REQUEST, "Start date and end date are required");
      }

      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw createHttpError(HttpStatus.BAD_REQUEST, "Invalid date format");
      }

      const payments = await this._paymentService.getPaymentsByDateRange(start, end);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Payments retrieved successfully",
        data: payments,
      });
    } catch (error) {
      next(error);
      throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve payments by date range");
    }
  }

  async getTotalRevenue(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const totalRevenue = await this._paymentService.getTotalRevenue();
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Total revenue retrieved successfully",
        data: { totalRevenue },
      });
    } catch (error) {
      next(error);
      throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve total revenue");
    }
  }

  async getTotalRevenueByTrainer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { trainerId } = req.params;
      if (!trainerId) {
        throw createHttpError(HttpStatus.BAD_REQUEST, "Trainer ID is required");
      }

      const totalRevenue = await this._paymentService.getTotalRevenueByTrainer(trainerId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Trainer revenue retrieved successfully",
        data: { totalRevenue },
      });
    } catch (error) {
      next(error);
      throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve trainer revenue");
    }
  }

  async updatePaymentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { paymentId } = req.params;
      const { status } = req.body;

      if (!paymentId) {
        throw createHttpError(HttpStatus.BAD_REQUEST, "Payment ID is required");
      }

      if (!status || !['pending', 'completed', 'failed', 'refunded'].includes(status)) {
        throw createHttpError(HttpStatus.BAD_REQUEST, "Valid status is required");
      }

      const updatedPayment = await this._paymentService.updatePaymentStatus(paymentId, status);
      if (!updatedPayment) {
        throw createHttpError(HttpStatus.NOT_FOUND, "Payment not found");
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Payment status updated successfully",
        data: updatedPayment,
      });
    } catch (error) {
      next(error);
      throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update payment status");
    }
  }

  async getPaymentByStripePaymentIntentId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { paymentIntentId } = req.params;
      if (!paymentIntentId) {
        throw createHttpError(HttpStatus.BAD_REQUEST, "Payment Intent ID is required");
      }

      const payment = await this._paymentService.getPaymentByStripePaymentIntentId(paymentIntentId);
      if (!payment) {
        throw createHttpError(HttpStatus.NOT_FOUND, "Payment not found");
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Payment retrieved successfully",
        data: payment,
      });
    } catch (error) {
      next(error);
      throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve payment");
    }
  }

  async getPaymentByStripeSessionId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params;
      if (!sessionId) {
        throw createHttpError(HttpStatus.BAD_REQUEST, "Session ID is required");
      }

      const payment = await this._paymentService.getPaymentByStripeSessionId(sessionId);
      if (!payment) {
        throw createHttpError(HttpStatus.NOT_FOUND, "Payment not found");
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Payment retrieved successfully",
        data: payment,
      });
    } catch (error) {
      next(error);
      throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve payment");
    }
  }
}
