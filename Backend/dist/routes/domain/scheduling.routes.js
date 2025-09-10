"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verify_token_middleware_1 = require("../../middleware/verify.token.middleware");
const Scheduling_service_1 = require("../../Services/domain/Scheduling.service");
const personalization_repository_1 = require("../../Repository/personalization.repository");
const Session_repository_1 = require("../../Repository/Session.repository");
const Scheduling_controller_1 = require("../../Controller/domain/Scheduling.controller");
const TrainerClientContract_repository_1 = require("../../Repository/TrainerClientContract.repository");
const router = express_1.default.Router();
const personalizationRepo = new personalization_repository_1.PersonalizationRepository();
const sessionRepo = new Session_repository_1.SessionRepository();
const contractRepo = new TrainerClientContract_repository_1.TrainerClientContractRepository();
const schedulingService = new Scheduling_service_1.SchedulingService(sessionRepo, personalizationRepo, contractRepo);
const schedulingController = new Scheduling_controller_1.SchedulingController(schedulingService);
// GET /api/trainers/:trainerId/availability?date=YYYY-MM-DD 
router.get('/trainers/:trainerId/availability', (0, verify_token_middleware_1.verifyAnyToken)(), (0, verify_token_middleware_1.restrictTo)('client', 'trainer', 'admin'), schedulingController.getAvailabilityForDate.bind(schedulingController));
// POST /api/bookings 
router.post('/bookings', (0, verify_token_middleware_1.verifyAnyToken)(), (0, verify_token_middleware_1.restrictTo)('client'), schedulingController.bookSlot.bind(schedulingController));
// PATCH /api/bookings/:bookingId/cancel
router.patch('/bookings/:bookingId/cancel', (0, verify_token_middleware_1.verifyAnyToken)(), (0, verify_token_middleware_1.restrictTo)('client', 'trainer', 'admin'), schedulingController.cancelBooking.bind(schedulingController));
router.patch('/bookings/:bookingId/complete', (0, verify_token_middleware_1.verifyAnyToken)(), (0, verify_token_middleware_1.restrictTo)('client', 'trainer', 'admin'), schedulingController.completeBooking.bind(schedulingController));
exports.default = router;
//# sourceMappingURL=scheduling.routes.js.map