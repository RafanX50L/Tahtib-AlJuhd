import { PlanController } from "@/Controller/domain/Plan.controller";
import { restrictTo } from "@/middleware/verify.token.middleware";
import { PersonalizationRepository } from "@/Repository/personalization.repository";
import { PlanRepository } from "@/Repository/Plan.repository";
import { PlanService } from "@/Services/domain/Plan.service";
import express from "express";

const router = express.Router();

const personalizationRepo = new PersonalizationRepository();
const planRepo = new PlanRepository();
const planService = new PlanService(planRepo, personalizationRepo);
const planController = new PlanController(planService);

router
  .route("/plan")
  .post(restrictTo('trainer'),planController.createPlan.bind(planController))
  .get(restrictTo('trainer','client'),planController.getPlansByTrainer.bind(planController));

export default router;
