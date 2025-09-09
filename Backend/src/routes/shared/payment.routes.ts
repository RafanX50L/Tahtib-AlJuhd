import { Router } from "express";
import { TrainerClientContractRepository } from "@/Repository/TrainerClientContract.repository";
import { SessionRepository } from "@/Repository/Session.repository";
import { ChatRepository } from "@/Repository/Chat.repository";
import { PlanRepository } from "@/Repository/Plan.repository";
import { PersonalizationRepository } from "@/Repository/personalization.repository";
import { BookingService } from "@/Services/domain/Booking.service";
import { BookingController } from "@/Controller/domain/Booking.controller";

const router = Router();

const bookingController = new BookingController(
  new BookingService(
    new TrainerClientContractRepository(),
    new SessionRepository(),
    new ChatRepository(),
    new PlanRepository(),
    new PersonalizationRepository()
  )
);

router.post(
  "/create-checkout-session",
  bookingController.checkOutSessionHandle.bind(bookingController)
);

export default router;
