import { HttpStatus } from "@/constants/status.constant";
import { IBookingController } from "@/core/interface/controllers/domain/IBooking.Controller";
import { IBookingService } from "@/core/interface/services/domain/IBooking.Service";
import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import { env } from "@/config/env.config";
import { 
  BookingDTO,
  CheckoutSessionRequestDTO
} from '@/dtos/reverse-mapping/domain/BookingDTO';
import { ControllerErrorHandler } from '@/utils/controller-error-handler.util';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const webhookSecret = env.WEBHOOK_SECRET;

export class BookingController implements IBookingController {
  constructor(private readonly _bookingService: IBookingService) {}

  async checkOutSessionHandle(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate and transform request body using DTO
      const validatedBody: CheckoutSessionRequestDTO = BookingDTO.validateCheckoutSessionRequest(req.body);
      
      const sessionId = await this._bookingService.handleCheckoutSession(
        validatedBody.userId,
        validatedBody.trainerId,
        validatedBody.planId
      );
      
      ControllerErrorHandler.handleSuccess(res, { id: sessionId }, "Checkout session created successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }
  
  async handlePaymentSucess(req: Request, res: Response, next: NextFunction) {
    try {
      const sig = req.headers["stripe-signature"];
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig!,
        webhookSecret
      );
      await this._bookingService.handlePaymentSuccess(event);
      
      ControllerErrorHandler.handleSuccess(res, null, "Payment processed successfully", HttpStatus.OK);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }
}
