import { HttpStatus } from "@/constants/status.constant";
import { IBookingController } from "@/core/interface/controllers/domain/IBooking.Controller";
import { IBookingService } from "@/core/interface/services/domain/IBooking.Service";
import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import { env } from "@/config/env.config";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const webhookSecret = env.WEBHOOK_SECRET;

export class BookingController implements IBookingController {
  constructor(private readonly _bookingService: IBookingService) {}

  // async purchasePlan(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { clientId, trainerId, planId } = req.body;
  //     const contract = await this._bookingService.purchasePlan(
  //       clientId,
  //       trainerId,
  //       planId
  //     );
  //     res.status(HttpStatus.OK).json(contract);
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  async checkOutSessionHandle(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("etnered here");
      console.log(req.body);
      const { userId, trainerId, planId } = req.body;
      const sessionId = await this._bookingService.handleCheckoutSession(
        userId,
        trainerId,
        planId
      );
      console.log("sesion", sessionId);
      res.status(HttpStatus.OK).json({ id: sessionId });
    } catch (error) {
      next(error);
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
      await this._bookingService.handlePaymentSucess(event);
      //  console.error(`⚠️ Webhook error: ${err.message}`);
      res.sendStatus(HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  }
}
