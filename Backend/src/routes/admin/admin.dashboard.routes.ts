import { Router } from "express";
import { AdminDashboardService } from "@/Services/admin/admin.dashboard.service";
import { AdminDashboardController } from "@/Controller/admin/admin.dashboard.controller";
import { UserRepository } from "@/Repository/user.Repository";
import { PaymentCollectionRepository } from "@/Repository/PaymentCollection.repository";
import { TrainerPersonalizationRepository } from "@/Repository/Trainer.personalization.repository";

const router = Router();

const service = new AdminDashboardService(
  new UserRepository(),
  new PaymentCollectionRepository(),
  new TrainerPersonalizationRepository(),
);
const controller = new AdminDashboardController(service);

router.get('/dashboard/stats', controller.getStats.bind(controller));
router.get('/dashboard/revenue', controller.getRevenueTrends.bind(controller));
router.get('/dashboard/top-trainers', controller.getTopTrainers.bind(controller));
router.get('/dashboard/recent-payments', controller.getRecentPayments.bind(controller));

export default router;


