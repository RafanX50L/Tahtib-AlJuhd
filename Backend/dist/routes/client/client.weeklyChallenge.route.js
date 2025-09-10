"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_weeklyChallenge_controller_1 = require("../../Controller/client/client.weeklyChallenge.controller");
const UserWeeklyChallenge_repository_1 = require("../../Repository/UserWeeklyChallenge.repository");
const WeeklyChallenge_repository_1 = require("../../Repository/WeeklyChallenge.repository");
const client_weeklyChallenge_service_1 = require("../../Services/client/client.weeklyChallenge.service");
const express_1 = require("express");
const weeklyChallengeRouter = (0, express_1.Router)();
const weeklyChallengeRepository = new WeeklyChallenge_repository_1.WeeklyChallengeRepository();
const userWeeklyChallengeRepository = new UserWeeklyChallenge_repository_1.UserWeeklyChallengeRepository();
const weeklyChallengeService = new client_weeklyChallenge_service_1.ClientWeeklyChallengeService(weeklyChallengeRepository, userWeeklyChallengeRepository);
const weeklyChallengeController = new client_weeklyChallenge_controller_1.ClientWeeklyChallengeController(weeklyChallengeService);
weeklyChallengeRouter.get('/weekly-challenges', weeklyChallengeController.getWeeklyChallenges.bind(weeklyChallengeController));
weeklyChallengeRouter.get('/weekly-challenges/:id', weeklyChallengeController.getWeeklyChallengeById.bind(weeklyChallengeController));
weeklyChallengeRouter.post('/join-weekly-challenge/:id', weeklyChallengeController.joinWeeklyChallenge.bind(weeklyChallengeController));
weeklyChallengeRouter.patch('/challenges/:challengeId/days/:dayNumber/complete', weeklyChallengeController.markChallengeDayComplete.bind(weeklyChallengeController));
exports.default = weeklyChallengeRouter;
//# sourceMappingURL=client.weeklyChallenge.route.js.map