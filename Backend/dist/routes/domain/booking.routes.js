"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Booking_controller_1 = require("../../Controller/domain/Booking.controller");
const Chat_repository_1 = require("../../Repository/Chat.repository");
const PaymentCollection_repository_1 = require("../../Repository/PaymentCollection.repository");
const personalization_repository_1 = require("../../Repository/personalization.repository");
const Plan_repository_1 = require("../../Repository/Plan.repository");
const Session_repository_1 = require("../../Repository/Session.repository");
const TrainerClientContract_repository_1 = require("../../Repository/TrainerClientContract.repository");
const Booking_service_1 = require("../../Services/domain/Booking.service");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const contractRepo = new TrainerClientContract_repository_1.TrainerClientContractRepository();
const sessionRepo = new Session_repository_1.SessionRepository();
const chatRepo = new Chat_repository_1.ChatRepository();
const planRepo = new Plan_repository_1.PlanRepository();
const personalizationRepo = new personalization_repository_1.PersonalizationRepository();
const _paymentRepo = new PaymentCollection_repository_1.PaymentCollectionRepository();
const bookingService = new Booking_service_1.BookingService(contractRepo, sessionRepo, chatRepo, planRepo, personalizationRepo, _paymentRepo);
const bookingController = new Booking_controller_1.BookingController(bookingService);
// router.post('/purchase-plan', bookingController.purchasePlan.bind(bookingController));
exports.default = router;
//# sourceMappingURL=booking.routes.js.map