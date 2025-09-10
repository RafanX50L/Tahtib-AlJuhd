"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_workoutPlan_controller_1 = require("../../Controller/client/client.workoutPlan.controller");
const personalization_repository_1 = require("../../Repository/personalization.repository");
const WorkoutPlan_repository_1 = require("../../Repository/WorkoutPlan.repository");
const client_workoutPlan_service_1 = require("../../Services/client/client.workoutPlan.service");
const express_1 = require("express");
const workoutPlanRouter = (0, express_1.Router)();
const workoutPlanRepository = new WorkoutPlan_repository_1.WorkoutPlanRepository();
const personalizationRepository = new personalization_repository_1.PersonalizationRepository();
const workoutPlanService = new client_workoutPlan_service_1.ClientWorkoutPlanService(workoutPlanRepository, personalizationRepository);
const workoutPlanController = new client_workoutPlan_controller_1.ClientWorkoutPlanController(workoutPlanService);
workoutPlanRouter.get('/workouts/:week', workoutPlanController.getWorkouts.bind(workoutPlanController));
workoutPlanRouter.patch('/workouts/complete-daily', workoutPlanController.completeDailyWorkoutAndFetchReport.bind(workoutPlanController));
exports.default = workoutPlanRouter;
//# sourceMappingURL=client.workoutPlan.routes.js.map