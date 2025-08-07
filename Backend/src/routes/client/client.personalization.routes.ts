import { ClientPersonalizationController } from "@/Controller/client/client.personalization.controller";
import { DietPlanRepository } from "@/Repository/DietPlan.repository";
import { PersonalizationRepository } from "@/Repository/personalization.repository";
import { UserRepository } from "@/Repository/user.Repository";
import { UserFileRepository } from "@/Repository/UserFile.repository";
import { WorkoutPlanRepository } from "@/Repository/WorkoutPlan.repository";
import { ClientPersonalizationService } from "@/Services/client/client.personalization.service";
import { Router } from "express";

const personalizationRouter = Router();

const personalizationRepository = new PersonalizationRepository();
const userRepository = new UserRepository();
const workoutPlanRepository = new WorkoutPlanRepository();
const dietPlanRepository = new DietPlanRepository();
const userFileRepository = new UserFileRepository();
const personalizationService = new ClientPersonalizationService(personalizationRepository,userRepository,workoutPlanRepository,dietPlanRepository,userFileRepository);
const personalizationController = new ClientPersonalizationController(personalizationService);

personalizationRouter.post('/generate-personalization',personalizationController.generatePersonalization.bind(personalizationController));
personalizationRouter.get('/workout-details',personalizationController.getWorkoutDetails.bind(personalizationController));
personalizationRouter.get('/clinet-profile',personalizationController.getProfileData.bind(personalizationController));
personalizationRouter.patch('/update-profile',personalizationController.updateClientProfile.bind(personalizationController));

export default personalizationRouter;