import express from "express";
import { TrainerClientContractRepository } from "@/Repository/TrainerClientContract.repository";
import { SessionRepository } from "@/Repository/Session.repository";
import { ChatRepository } from "@/Repository/Chat.repository";
import { PlanRepository } from "@/Repository/Plan.repository";
import { PersonalizationRepository } from "@/Repository/personalization.repository";
import { BookingService } from "@/Services/domain/booking.service";
import { BookingController } from "@/Controller/domain/booking.controller";
import { PaymentCollectionRepository } from "@/Repository/PaymentCollection.repository";

const router = express.Router();

const bookingController = new BookingController(
  new BookingService(
    new TrainerClientContractRepository(),
    new SessionRepository(),
    new ChatRepository(),
    new PlanRepository(),
    new PersonalizationRepository(),
    new PaymentCollectionRepository()
  )
);

router.post("/", express.raw({ type: "application/json" }), bookingController.handlePaymentSucess.bind(bookingController));

export default router;
