import { ClientWeeklyChallengeController } from "../../Controller/client/client.weeklyChallenge.controller";
import { UserWeeklyChallengeRepository } from "../../Repository/UserWeeklyChallenge.repository";
import { WeeklyChallengeRepository } from "../../Repository/WeeklyChallenge.repository";
import { ClientWeeklyChallengeService } from "../../Services/client/client.weeklyChallenge.service";
import { Router } from "express";
const weeklyChallengeRouter = Router();
const weeklyChallengeRepository = new WeeklyChallengeRepository();
const userWeeklyChallengeRepository = new UserWeeklyChallengeRepository();
const weeklyChallengeService = new ClientWeeklyChallengeService(weeklyChallengeRepository, userWeeklyChallengeRepository);
const weeklyChallengeController = new ClientWeeklyChallengeController(weeklyChallengeService);
weeklyChallengeRouter.get('/weekly-challenges', weeklyChallengeController.getWeeklyChallenges.bind(weeklyChallengeController));
weeklyChallengeRouter.get('/weekly-challenges/:id', weeklyChallengeController.getWeeklyChallengeById.bind(weeklyChallengeController));
weeklyChallengeRouter.post('/join-weekly-challenge/:id', weeklyChallengeController.joinWeeklyChallenge.bind(weeklyChallengeController));
weeklyChallengeRouter.patch('/challenges/:challengeId/days/:dayNumber/complete', weeklyChallengeController.markChallengeDayComplete.bind(weeklyChallengeController));
export default weeklyChallengeRouter;
//# sourceMappingURL=client.weeklyChallenge.route.js.map