import { ClientDietPlanController } from "@/Controller/client/client.dietPlan.controller";
import { DietPlanRepository } from "@/Repository/DietPlan.repository";
import { PersonalizationRepository } from "@/Repository/personalization.repository";
import { ClientDietPlanService } from "@/Services/client/client.dietPlan.service";
import { Router } from "express";

const dietPlanRouter = Router();

const dietPlanRepository = new DietPlanRepository();
const clientPersonalizationRepository = new PersonalizationRepository();
const dietPlanService = new ClientDietPlanService(dietPlanRepository,clientPersonalizationRepository);
const dietPlanController = new ClientDietPlanController(dietPlanService);

dietPlanRouter.get('/diet-plan',dietPlanController.getDietPlan.bind(dietPlanController));

export default dietPlanRouter;