import { Router } from "express";
import { TrainerClientContractRepository } from "@/Repository/TrainerClientContract.repository";
import { SessionRepository } from "@/Repository/Session.repository";
import { ChatRepository } from "@/Repository/Chat.repository";
import { PlanRepository } from "@/Repository/Plan.repository";
import { PersonalizationRepository } from "@/Repository/personalization.repository";
import { PaymentCollectionRepository } from "@/Repository/PaymentCollection.repository";
import { BookingService } from "@/Services/domain/Booking.service";
import { BookingController } from "@/Controller/domain/Booking.controller";
import { PaymentController } from "@/Controller/admin/Payment.controller";
import { PaymentService } from "@/Services/domain/Payment.service";

const router = Router();

// Initialize repositories
const paymentRepository = new PaymentCollectionRepository();

const bookingController = new BookingController(
  new BookingService(
    new TrainerClientContractRepository(),
    new SessionRepository(),
    new ChatRepository(),
    new PlanRepository(),
    new PersonalizationRepository(),
    paymentRepository
  )
);

const paymentController = new PaymentController(
  new PaymentService(paymentRepository)
);

// Booking routes
router.post(
  "/create-checkout-session",
  bookingController.checkOutSessionHandle.bind(bookingController)
);

// Admin payment routes
router.get("/admin", paymentController.getAllPayments.bind(paymentController));
router.get("/admin/client/:clientId", paymentController.getPaymentsByClient.bind(paymentController));
router.get("/admin/trainer/:trainerId", paymentController.getPaymentsByTrainer.bind(paymentController));
router.get("/admin/:paymentId", paymentController.getPaymentById.bind(paymentController));
router.get("/admin/date-range", paymentController.getPaymentsByDateRange.bind(paymentController));
router.get("/admin/revenue/total", paymentController.getTotalRevenue.bind(paymentController));
router.get("/admin/revenue/trainer/:trainerId", paymentController.getTotalRevenueByTrainer.bind(paymentController));
router.get("/admin/stripe/payment-intent/:paymentIntentId", paymentController.getPaymentByStripePaymentIntentId.bind(paymentController));
router.get("/admin/stripe/session/:sessionId", paymentController.getPaymentByStripeSessionId.bind(paymentController));
router.patch("/admin/:paymentId/status", paymentController.updatePaymentStatus.bind(paymentController));

export default router;
