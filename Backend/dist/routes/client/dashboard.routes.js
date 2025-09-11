"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Dashboard_controller_1 = require("../../Controller/client/Dashboard.controller");
const Dashboard_service_1 = require("../../Services/client/Dashboard.service");
const personalization_repository_1 = require("../../Repository/personalization.repository");
const Progress_repository_1 = require("../../Repository/Progress.repository");
const Session_repository_1 = require("../../Repository/Session.repository");
const UserWeeklyChallenge_repository_1 = require("../../Repository/UserWeeklyChallenge.repository");
const WorkoutPlan_repository_1 = require("../../Repository/WorkoutPlan.repository");
const router = (0, express_1.Router)();
// Initialize dependencies
const personalizationRepo = new personalization_repository_1.PersonalizationRepository();
const progressRepo = new Progress_repository_1.ProgressRepository();
const sessionRepo = new Session_repository_1.SessionRepository();
const userWeeklyChallengeRepo = new UserWeeklyChallenge_repository_1.UserWeeklyChallengeRepository();
const workoutPlanRepo = new WorkoutPlan_repository_1.WorkoutPlanRepository();
const dashboardService = new Dashboard_service_1.DashboardService(personalizationRepo, progressRepo, sessionRepo, userWeeklyChallengeRepo, workoutPlanRepo);
const dashboardController = new Dashboard_controller_1.DashboardController(dashboardService);
// Dashboard routes
router.get("/stats/:clientId", dashboardController.getClientDashboardStats.bind(dashboardController));
router.get("/stats", dashboardController.getClientDashboardStats.bind(dashboardController)); // For current user
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map