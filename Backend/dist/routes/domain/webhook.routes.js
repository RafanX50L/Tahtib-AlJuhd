"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TrainerClientContract_repository_1 = require("../../Repository/TrainerClientContract.repository");
const Session_repository_1 = require("../../Repository/Session.repository");
const Chat_repository_1 = require("../../Repository/Chat.repository");
const Plan_repository_1 = require("../../Repository/Plan.repository");
const personalization_repository_1 = require("../../Repository/personalization.repository");
const Booking_service_1 = require("../../Services/domain/Booking.service");
const Booking_controller_1 = require("../../Controller/domain/Booking.controller");
const PaymentCollection_repository_1 = require("../../Repository/PaymentCollection.repository");
const router = express_1.default.Router();
const bookingController = new Booking_controller_1.BookingController(new Booking_service_1.BookingService(new TrainerClientContract_repository_1.TrainerClientContractRepository(), new Session_repository_1.SessionRepository(), new Chat_repository_1.ChatRepository(), new Plan_repository_1.PlanRepository(), new personalization_repository_1.PersonalizationRepository(), new PaymentCollection_repository_1.PaymentCollectionRepository()));
router.post("/", express_1.default.raw({ type: "application/json" }), bookingController.handlePaymentSucess.bind(bookingController));
exports.default = router;
//# sourceMappingURL=webhook.routes.js.map