import { Router } from "express";
import { TrainerDashboardService } from "@/Services/trainer/trainer.dashboard.service";
import { TrainerDashboardController } from "@/Controller/trainer/trainer.dashboard.controller";
import { TrainerClientContractRepository } from "@/Repository/TrainerClientContract.repository";
import { SessionRepository } from "@/Repository/Session.repository";
import { PlanRepository } from "@/Repository/Plan.repository";
import { PaymentCollectionRepository } from "@/Repository/PaymentCollection.repository";

const router = Router();

const contractRepo = new TrainerClientContractRepository();
const sessionRepo = new SessionRepository();
const planRepo = new PlanRepository();
const paymentRepo = new PaymentCollectionRepository();

const service = new TrainerDashboardService(contractRepo, sessionRepo, planRepo, paymentRepo);
const controller = new TrainerDashboardController(service);

router.get('/dashboard/stats', controller.getStats.bind(controller));
router.get('/dashboard/trends', controller.getTrends.bind(controller));
router.get('/dashboard/payments', controller.getPayments.bind(controller));

export default router;

 