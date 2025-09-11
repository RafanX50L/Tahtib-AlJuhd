"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trainer_dashboard_service_1 = require("../../Services/trainer/trainer.dashboard.service");
const trainer_dashboard_controller_1 = require("../../Controller/trainer/trainer.dashboard.controller");
const TrainerClientContract_repository_1 = require("../../Repository/TrainerClientContract.repository");
const Session_repository_1 = require("../../Repository/Session.repository");
const Plan_repository_1 = require("../../Repository/Plan.repository");
const router = (0, express_1.Router)();
const contractRepo = new TrainerClientContract_repository_1.TrainerClientContractRepository();
const sessionRepo = new Session_repository_1.SessionRepository();
const planRepo = new Plan_repository_1.PlanRepository();
const service = new trainer_dashboard_service_1.TrainerDashboardService(contractRepo, sessionRepo, planRepo);
const controller = new trainer_dashboard_controller_1.TrainerDashboardController(service);
router.get('/dashboard/stats', controller.getStats.bind(controller));
exports.default = router;
//# sourceMappingURL=trainer.dashboard.routes.js.map