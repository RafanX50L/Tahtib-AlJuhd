import { PlanController } from "@/Controller/domain/plan.controller";
import { restrictTo } from "@/middleware/verify.token.middleware";
import { PersonalizationRepository } from "@/Repository/personalization.repository";
import { PlanRepository } from "@/Repository/Plan.repository";
import { PlanService } from "@/Services/domain/plan.service";
import express from "express";

const router = express.Router();

const personalizationRepo = new PersonalizationRepository();
const planRepo = new PlanRepository();
const planService = new PlanService(planRepo, personalizationRepo);
const planController = new PlanController(planService);

router
  .route("/plan")
  .post(restrictTo('trainer'),planController.createPlan.bind(planController))
  .get(restrictTo('trainer','client'),planController.getPlansByTrainer.bind(planController))
  .put(restrictTo('trainer'),planController.updatePlan.bind(planController))
  .patch(restrictTo('trainer'),planController.deactivatePlan.bind(planController));

export default router;
