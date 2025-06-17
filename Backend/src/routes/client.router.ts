import verifyToken from "../middleware/verify.token.middleware";
import { ClientController } from "../controllers/implementation/client.controller";
import { ClientRepository } from "../repositories/implementation/client.repository";
import { ClientService } from "../services/implementation/Client.service";
import { Router } from "express";
import isBlocked from "../middleware/isBlocked.middleware";

const clientRouter = Router();

const clientRepository = new ClientRepository();
const clientService = new ClientService(clientRepository);
const clientController = new ClientController(clientService);

clientRouter.use('/',verifyToken('client'),isBlocked());

clientRouter.post('/generate-fitness-plan',clientController.generateFitnessPlan.bind(clientController));
clientRouter.get('/get-basic-fitness-details',clientController.getBasicFitnessPlan.bind(clientController));
clientRouter.get('/get-workouts/:week', clientController.getWorkouts.bind(clientController));
clientRouter.get('/get-week-completion-status', clientController.getWeekCompletionStatus.bind(clientController));
clientRouter.patch('/update-day-completion-status', clientController.updateDayCompletionStatus.bind(clientController));
clientRouter.get('/get-workout-report', clientController.getWorkoutReport.bind(clientController));
clientRouter.get('/get-weekly-challenges', clientController.getWeeklyChallenges.bind(clientController));
clientRouter.get('/get-weekly-challenges/:id', clientController.getChallengeById.bind(clientController));
clientRouter.post('/join-weekly-challenge/:id', clientController.joinWeeklyChallenge.bind(clientController));
clientRouter.patch('/update-day-completion-of-weekly-challenge-status', clientController.updateDayCompletionOfWeeklyChallengeStatus.bind(clientController));

export default clientRouter;