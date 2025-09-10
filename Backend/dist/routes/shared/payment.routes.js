"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TrainerClientContract_repository_1 = require("../../Repository/TrainerClientContract.repository");
const Session_repository_1 = require("../../Repository/Session.repository");
const Chat_repository_1 = require("../../Repository/Chat.repository");
const Plan_repository_1 = require("../../Repository/Plan.repository");
const personalization_repository_1 = require("../../Repository/personalization.repository");
const PaymentCollection_repository_1 = require("../../Repository/PaymentCollection.repository");
const Booking_service_1 = require("../../Services/domain/Booking.service");
const Booking_controller_1 = require("../../Controller/domain/Booking.controller");
const Payment_controller_1 = require("../../Controller/admin/Payment.controller");
const Payment_service_1 = require("../../Services/domain/Payment.service");
const router = (0, express_1.Router)();
// Initialize repositories
const paymentRepository = new PaymentCollection_repository_1.PaymentCollectionRepository();
const bookingController = new Booking_controller_1.BookingController(new Booking_service_1.BookingService(new TrainerClientContract_repository_1.TrainerClientContractRepository(), new Session_repository_1.SessionRepository(), new Chat_repository_1.ChatRepository(), new Plan_repository_1.PlanRepository(), new personalization_repository_1.PersonalizationRepository(), paymentRepository));
const paymentController = new Payment_controller_1.PaymentController(new Payment_service_1.PaymentService(paymentRepository));
// Booking routes
router.post("/create-checkout-session", bookingController.checkOutSessionHandle.bind(bookingController));
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
exports.default = router;
//# sourceMappingURL=payment.routes.js.map