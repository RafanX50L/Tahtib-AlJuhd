import { Router } from "express";
import { DashboardController } from "@/Controller/client/client.dashboard.controller";
import { DashboardService } from "@/Services/client/client.dashboard.service";
import { PersonalizationRepository } from "@/Repository/personalization.repository";
import { ProgressRepository } from "@/Repository/Progress.repository";
import { SessionRepository } from "@/Repository/Session.repository";
import { UserWeeklyChallengeRepository } from "@/Repository/UserWeeklyChallenge.repository";

const router = Router();

// Initialize dependencies
const personalizationRepo = new PersonalizationRepository();
const progressRepo = new ProgressRepository();
const sessionRepo = new SessionRepository();
const userWeeklyChallengeRepo = new UserWeeklyChallengeRepository();

const dashboardService = new DashboardService(
  personalizationRepo,
  progressRepo,
  sessionRepo,
  userWeeklyChallengeRepo,
);

const dashboardController = new DashboardController(dashboardService);

// Dashboard routes
router.get("/stats/:clientId", dashboardController.getClientDashboardStats.bind(dashboardController));
router.get("/stats", dashboardController.getClientDashboardStats.bind(dashboardController));

export default router;
