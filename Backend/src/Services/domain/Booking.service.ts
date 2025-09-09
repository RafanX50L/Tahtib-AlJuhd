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
import { ITrainerClientContract } from "@/core/interface/model/ITrainerClientContract";
import { IBookingService } from "@/core/interface/services/domain/IBooking.Service";
import Stripe from "stripe";
import { env } from "@/config/env.config";
import { createHttpError } from "@/utils";
import { Http } from "winston/lib/winston/transports";
import { HttpStatus } from "@/constants/status.constant";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const webhookSecret = env.WEBHOOK_SECRET;

export class BookingService implements IBookingService {
  constructor(
    private readonly _contractRepo: ITrainerClientContractRepository,
    private readonly _sessionRepo: ISessionRepository,
    private readonly _chatRepo: IChatRepository,
    private readonly _planRepo: IPlanRepository,
    private readonly _personalizationRepo: IPersonalizationRepository
  ) {}

  // async purchasePlan(
  //   clientId: string,
  //   trainerId: string,
  //   planId: string
  // ): Promise<string> {
  //   const plan = await this._planRepo.findById(new Types.ObjectId(planId));
  //   if (!plan) throw new Error("Plan not found");

  //   const clientPers = await this._personalizationRepo.findByUserId(clientId);
  //   if (!clientPers) throw new Error("Client not found");
  //   const clientData = clientPers.data as IClientPersonalization;

  //   if (
  //     clientData.currentTrainerId &&
  //     clientData.currentTrainerId.toString() !== trainerId
  //   ) {
  //     const activeContract =
  //       await this._contractRepo.findActiveByClientAndTrainer(
  //         clientId,
  //         clientData.currentTrainerId.toString()
  //       );
  //     if (activeContract)
  //       throw new Error("Client has an active contract with another trainer");
  //   }

  //   const startDate = new Date();
  //   const endDate = addWeeks(startDate, plan.durationWeeks);

  //   const chat = await this._chatRepo.create({
  //     participants: [
  //       new Types.ObjectId(trainerId),
  //       new Types.ObjectId(clientId),
  //     ],
  //     messages: [],
  //   });

  //   const contract: ITrainerClientContract = {
  //     trainerId: new Types.ObjectId(trainerId),
  //     clientId: new Types.ObjectId(clientId),
  //     planId: new Types.ObjectId(planId),
  //     startDate,
  //     endDate,
  //     sessionsRemaining: plan.sessionsPerWeek * plan.durationWeeks,
  //     chatId: chat.id!,
  //   } as ITrainerClientContract;

  //   const newContract = await this._contractRepo.create(contract);

  //   await this._planRepo.update(plan.id, { isBooked: true });
  //   await this._personalizationRepo.updateClientData(clientId, {
  //     ...clientData,
  //     currentTrainerId: new Types.ObjectId(trainerId),
  //     chatsId: [
  //       ...(clientData.chatsId || []),
  //       { trainerId: new Types.ObjectId(trainerId), chatId: chat.id! },
  //     ],
  //     contracts: [...(clientData.contracts || []), newContract.id!],
  //     planStatus: "Active",
  //   });

  //   const trainerPers = await this._personalizationRepo.findByUserId(trainerId);
  //   if (!trainerPers) throw new Error("Trainer not found");
  //   const trainerData = trainerPers.data as ITrainerPersonalization;
  //   await this._personalizationRepo.updateTrainerData(trainerId, {
  //     ...trainerData,
  //     chats: [...(trainerData.chats || []), chat.id!],
  //     contracts: [...(trainerData.contracts || []), newContract.id!],
  //   });

  //   return "new contract";
  //   // in the updated version we will asing payment url this returning string is just for now
  // }

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
      success_url: `http://localhost:5173/trainerSession`,
      cancel_url: `http://localhost:5173/trainer-details/${trainerId}?payment_status=cancelled`,
      metadata: {
        userId: userId || "unknown",
        trainerId: trainerId || "unknown",
        planId: planId || "unknown",
      },
    });

    console.log("Created checkout session:", session.id, "for user:", userId);
    return session.id;
  }
  async handlePaymentSucess(event: Stripe.Event) {
    console.log("Handling payment success event:", event);
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("✅ Raw PaymentIntent succeeded:", paymentIntent.id);
      // TODO: update MongoDB here (e.g. mark user as paid)
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("✅ Checkout session completed:", session.id);
      const { userId, trainerId, planId } = session.metadata || {};
      console.log("Metadata:", { userId, trainerId, planId });

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
