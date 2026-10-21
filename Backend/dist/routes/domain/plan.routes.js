"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Plan_controller_1 = require("../../Controller/domain/Plan.controller");
const verify_token_middleware_1 = require("../../middleware/verify.token.middleware");
const personalization_repository_1 = require("../../Repository/personalization.repository");
const Plan_repository_1 = require("../../Repository/Plan.repository");
const Plan_service_1 = require("../../Services/domain/Plan.service");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const personalizationRepo = new personalization_repository_1.PersonalizationRepository();
const planRepo = new Plan_repository_1.PlanRepository();
const planService = new Plan_service_1.PlanService(planRepo, personalizationRepo);
const planController = new Plan_controller_1.PlanController(planService);
router
    .route("/plan")
    .post((0, verify_token_middleware_1.restrictTo)('trainer'), planController.createPlan.bind(planController))
    .get((0, verify_token_middleware_1.restrictTo)('trainer', 'client'), planController.getPlansByTrainer.bind(planController))
    .put((0, verify_token_middleware_1.restrictTo)('trainer'), planController.updatePlan.bind(planController))
    .patch((0, verify_token_middleware_1.restrictTo)('trainer'), planController.deactivatePlan.bind(planController));
exports.default = router;
//# sourceMappingURL=plan.routes.js.map