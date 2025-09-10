"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Availability_Controller_1 = require("../../Controller/domain/Availability.Controller");
const verify_token_middleware_1 = require("../../middleware/verify.token.middleware");
const personalization_repository_1 = require("../../Repository/personalization.repository");
const Session_repository_1 = require("../../Repository/Session.repository");
const Availability_service_1 = require("../../Services/domain/Availability.service");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const personalizationRepo = new personalization_repository_1.PersonalizationRepository();
const sessionRepo = new Session_repository_1.SessionRepository();
const availabilityService = new Availability_service_1.AvailabilityService(personalizationRepo, sessionRepo);
const availabilityController = new Availability_Controller_1.AvailabilityController(availabilityService);
// router.post('/availability/',restrictTo('trainer'), availabilityController.setAvailability.bind(availabilityController));
router.get('/availability/slots', (0, verify_token_middleware_1.restrictTo)('trainer', 'client'), availabilityController.getUnFreeSlots.bind(availabilityController));
// New: set weekly day-level rules
router.post('/availability/rules', (0, verify_token_middleware_1.restrictTo)('trainer'), availabilityController.setWeeklyRules.bind(availabilityController));
router.get('/availability/rules', (0, verify_token_middleware_1.restrictTo)('trainer', 'client'), availabilityController.getWeeklyRules.bind(availabilityController));
exports.default = router;
//# sourceMappingURL=availability.routes.js.map