"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_dashboard_service_1 = require("../../Services/admin/admin.dashboard.service");
const admin_dashboard_controller_1 = require("../../Controller/admin/admin.dashboard.controller");
const user_Repository_1 = require("../../Repository/user.Repository");
const PaymentCollection_repository_1 = require("../../Repository/PaymentCollection.repository");
const Trainer_personalization_repository_1 = require("../../Repository/Trainer.personalization.repository");
const router = (0, express_1.Router)();
const service = new admin_dashboard_service_1.AdminDashboardService(new user_Repository_1.UserRepository(), new PaymentCollection_repository_1.PaymentCollectionRepository(), new Trainer_personalization_repository_1.TrainerPersonalizationRepository());
const controller = new admin_dashboard_controller_1.AdminDashboardController(service);
router.get('/dashboard/stats', controller.getStats.bind(controller));
router.get('/dashboard/revenue', controller.getRevenueTrends.bind(controller));
router.get('/dashboard/top-trainers', controller.getTopTrainers.bind(controller));
router.get('/dashboard/recent-payments', controller.getRecentPayments.bind(controller));
exports.default = router;
//# sourceMappingURL=admin.dashboard.routes.js.map