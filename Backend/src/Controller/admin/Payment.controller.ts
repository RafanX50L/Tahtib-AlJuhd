import { NextFunction, Request, Response } from "express";
import { IPaymentController } from "@/core/interface/controllers/admin/IPayment.Controller";
import { IPaymentService } from "@/core/interface/services/domain/IPayment.Service";
import { 
  AdminPaymentDTO,
  GetPaymentsByClientRequestDTO,
  GetPaymentsByTrainerRequestDTO,
  GetPaymentByIdRequestDTO,
  GetPaymentsByDateRangeRequestDTO,
  GetTotalRevenueByTrainerRequestDTO,
  UpdatePaymentStatusRequestDTO,
  GetPaymentByStripePaymentIntentIdRequestDTO,
  GetPaymentByStripeSessionIdRequestDTO
} from "@/dtos/reverse-mapping/admin/PaymentDTO";
import { ControllerErrorHandler } from "@/utils/controller-error-handler.util";

export class PaymentController implements IPaymentController {
  constructor(
    private readonly _paymentService: IPaymentService
  ) {}

  async getAllPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payments = await this._paymentService.getAllPayments();
      ControllerErrorHandler.handleSuccess(res, payments, "Payments retrieved successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getPaymentsByClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate and transform request parameters using DTO
      const validatedParams: GetPaymentsByClientRequestDTO = AdminPaymentDTO.validateGetPaymentsByClientRequest(req.params);
      
      // Call service with validated parameters - service already returns DTOs
      const payments = await this._paymentService.getPaymentsByClient(validatedParams.clientId);
      
      ControllerErrorHandler.handleSuccess(res, payments, "Client payments retrieved successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getPaymentsByTrainer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate and transform request parameters using DTO
      const validatedParams: GetPaymentsByTrainerRequestDTO = AdminPaymentDTO.validateGetPaymentsByTrainerRequest(req.params);
      
      // Call service with validated parameters - service already returns DTOs
      const payments = await this._paymentService.getPaymentsByTrainer(validatedParams.trainerId);
      
      ControllerErrorHandler.handleSuccess(res, payments, "Trainer payments retrieved successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getPaymentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate and transform request parameters using DTO
      const validatedParams: GetPaymentByIdRequestDTO = AdminPaymentDTO.validateGetPaymentByIdRequest(req.params);
      
      // Call service with validated parameters - service already returns DTOs
      const payment = await this._paymentService.getPaymentById(validatedParams.paymentId);
      
      if (!payment) {
        ControllerErrorHandler.handleNotFound(res, "Payment not found");
        return;
      }
      
      ControllerErrorHandler.handleSuccess(res, payment, "Payment retrieved successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getPaymentsByDateRange(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate and transform request parameters using DTO
      const validatedParams: GetPaymentsByDateRangeRequestDTO = AdminPaymentDTO.validateGetPaymentsByDateRangeRequest(req.query);
      
      // Call service with validated parameters - service already returns DTOs
      const start = new Date(validatedParams.startDate);
      const end = new Date(validatedParams.endDate);
      const payments = await this._paymentService.getPaymentsByDateRange(start, end);
      
      ControllerErrorHandler.handleSuccess(res, payments, "Payments retrieved successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getTotalRevenue(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const totalRevenue = await this._paymentService.getTotalRevenue();
      ControllerErrorHandler.handleSuccess(res, { totalRevenue }, "Total revenue retrieved successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getTotalRevenueByTrainer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate and transform request parameters using DTO
      const validatedParams: GetTotalRevenueByTrainerRequestDTO = AdminPaymentDTO.validateGetTotalRevenueByTrainerRequest(req.params);
      
      // Call service with validated parameters - service already returns DTOs
      const totalRevenue = await this._paymentService.getTotalRevenueByTrainer(validatedParams.trainerId);
      
      ControllerErrorHandler.handleSuccess(res, { totalRevenue }, "Trainer revenue retrieved successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async updatePaymentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate and transform request parameters using DTO
      const validatedParams: UpdatePaymentStatusRequestDTO = AdminPaymentDTO.validateUpdatePaymentStatusRequest(req.params, req.body);
      
      // Call service with validated parameters - service already returns DTOs
      const updatedPayment = await this._paymentService.updatePaymentStatus(validatedParams.paymentId, validatedParams.status);
      
      if (!updatedPayment) {
        ControllerErrorHandler.handleNotFound(res, "Payment not found");
        return;
      }
      
      ControllerErrorHandler.handleSuccess(res, updatedPayment, "Payment status updated successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getPaymentByStripePaymentIntentId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate and transform request parameters using DTO
      const validatedParams: GetPaymentByStripePaymentIntentIdRequestDTO = AdminPaymentDTO.validateGetPaymentByStripePaymentIntentIdRequest(req.params);
      
      // Call service with validated parameters - service already returns DTOs
      const payment = await this._paymentService.getPaymentByStripePaymentIntentId(validatedParams.paymentIntentId);
      
      if (!payment) {
        ControllerErrorHandler.handleNotFound(res, "Payment not found");
        return;
      }
      
      ControllerErrorHandler.handleSuccess(res, payment, "Payment retrieved successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getPaymentByStripeSessionId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate and transform request parameters using DTO
      const validatedParams: GetPaymentByStripeSessionIdRequestDTO = AdminPaymentDTO.validateGetPaymentByStripeSessionIdRequest(req.params);
      
      // Call service with validated parameters - service already returns DTOs
      const payment = await this._paymentService.getPaymentByStripeSessionId(validatedParams.sessionId);
      
      if (!payment) {
        ControllerErrorHandler.handleNotFound(res, "Payment not found");
        return;
      }
      
      ControllerErrorHandler.handleSuccess(res, payment, "Payment retrieved successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }
}
