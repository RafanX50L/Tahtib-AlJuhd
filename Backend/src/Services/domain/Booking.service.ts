import { Types } from "mongoose";
import {
  ITrainerPersonalization,
  IClientPersonalization,
} from "@/core/interface/model/IPersonalization.model";
import { addWeeks } from "date-fns";
import { ITrainerClientContractRepository } from "@/core/interface/repositories/ITrainerClientContract.repository";
import { ISessionRepository } from "@/core/interface/repositories/ISession.repository";
import { IChatRepository } from "@/core/interface/repositories/IChat.repository";
import { IPlanRepository } from "@/core/interface/repositories/IPlanRepository";
import { IPersonalizationRepository } from "@/core/interface/repositories/IPersonalization.repository";
import { IPaymentRepository } from "@/core/interface/repositories/IPaymentRepository";
import { ITrainerClientContract } from "@/core/interface/model/ITrainerClientContract";
import { IBookingService } from "@/core/interface/services/domain/IBooking.Service";
import Stripe from "stripe";
import logger from "@/utils/logger.utils";
import { env } from "@/config/env.config";
import { createHttpError } from "@/utils";
import { HttpStatus } from "@/constants/status.constant";
import { IPaymentCollection } from "@/core/interface/model/IPaymentCollection";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export class BookingService implements IBookingService {
  constructor(
    private readonly _contractRepo: ITrainerClientContractRepository,
    private readonly _sessionRepo: ISessionRepository,
    private readonly _chatRepo: IChatRepository,
    private readonly _planRepo: IPlanRepository,
    private readonly _personalizationRepo: IPersonalizationRepository,
    private readonly _paymentRepo: IPaymentRepository
  ) {}

  async handleCheckoutSession(
    userId: string,
    trainerId: string,
    planId: string
  ) {
    const plan = await this._planRepo.findById(new Types.ObjectId(planId));
    if (!plan) throw new Error("Plan not found");

    const clientPers = await this._personalizationRepo.findByUserId(userId);
    if (!clientPers) throw new Error("Client not found");
    const clientData = clientPers.data as IClientPersonalization;

    if (clientData.currentTrainerId && clientData.currentTrainerId.toString() !== trainerId) {
      const activeContract = await this._contractRepo.findActiveByClientAndTrainer(userId, clientData.currentTrainerId.toString());
      if (activeContract) throw createHttpError(HttpStatus.CONFLICT,'Client has an active contract with another trainer');
    }
    const line_items = [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: plan.title,
            description: plan.description,
          },
          unit_amount: plan.price * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: `${env.CLIENT_URL}/trainerSession`,
      cancel_url: `${env.CLIENT_URL}/${trainerId}?payment_status=cancelled`,
      metadata: {
        userId: userId || "unknown",
        trainerId: trainerId || "unknown",
        planId: planId || "unknown",
      },
    });

    return session.id;
  }
  async handlePaymentSuccess(event: Stripe.Event) {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      logger.info("✅ Raw PaymentIntent succeeded:", paymentIntent.id);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, trainerId, planId } = session.metadata || {};

      const plan = await this._planRepo.findById(new Types.ObjectId(planId));
      if (!plan) throw new Error("Plan not found");

      const clientPers = await this._personalizationRepo.findByUserId(userId);
      if (!clientPers) throw new Error("Client not found");
      const clientData = clientPers.data as IClientPersonalization;

      const startDate = new Date();
      const endDate = addWeeks(startDate, plan.durationWeeks);

      const chat = await this._chatRepo.create({
        participants: [
          new Types.ObjectId(trainerId),
          new Types.ObjectId(userId),
        ],
        messages: [],
      });

      const contract: ITrainerClientContract = {
        trainerId: new Types.ObjectId(trainerId),
        clientId: new Types.ObjectId(userId),
        planId: new Types.ObjectId(planId),
        startDate,
        endDate,
        sessionsRemaining: plan.sessionsPerWeek * plan.durationWeeks,
        chatId: chat.id!,
      } as ITrainerClientContract;

      const newContract = await this._contractRepo.create(contract);

      // Save payment information to database
      const paymentData = {
        clientId: new Types.ObjectId(userId),
        trainerId: new Types.ObjectId(trainerId),
        planId: new Types.ObjectId(planId),
        contractId: newContract.id!,
        amount: plan.price,
        currency: 'inr',
        paymentStatus: 'completed' as IPaymentCollection['paymentStatus'],
        stripePaymentIntentId: session.payment_intent as string,
        stripeSessionId: session.id,
        paymentMethod: 'card',
        transactionId: session.payment_intent as string,
      };

      await this._paymentRepo.create(paymentData);
      logger.info("✅ Payment information saved to database");

      await this._planRepo.update(plan.id, { isBooked: true });
      await this._personalizationRepo.updateClientData(userId, {
        ...clientData,
        currentTrainerId: new Types.ObjectId(trainerId),
        chatsId: [
          ...(clientData.chatsId || []),
          { trainerId: new Types.ObjectId(trainerId), chatId: chat.id! },
        ],
        contracts: [...(clientData.contracts || []), newContract.id!],
        planStatus: "Active",
      });

      const trainerPers =
        await this._personalizationRepo.findByUserId(trainerId);
      if (!trainerPers) throw new Error("Trainer not found");
      const trainerData = trainerPers.data as ITrainerPersonalization;
      await this._personalizationRepo.updateTrainerData(trainerId, {
        ...trainerData,
        chats: [...(trainerData.chats || []), chat.id!],
        contracts: [...(trainerData.contracts || []), newContract.id!],
      });
    }
  }
}
