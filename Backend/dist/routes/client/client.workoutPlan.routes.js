import { ClientWorkoutPlanController } from "../../Controller/client/client.workoutPlan.controller";
import { PersonalizationRepository } from "../../Repository/personalization.repository";
import { WorkoutPlanRepository } from "../../Repository/WorkoutPlan.repository";
import { ClientWorkoutPlanService } from "../../Services/client/client.workoutPlan.service";
import { Router } from "express";
const workoutPlanRouter = Router();
const workoutPlanRepository = new WorkoutPlanRepository();
const personalizationRepository = new PersonalizationRepository();
const workoutPlanService = new ClientWorkoutPlanService(workoutPlanRepository, personalizationRepository);
const workoutPlanController = new ClientWorkoutPlanController(workoutPlanService);
workoutPlanRouter.get('/workouts/:week', workoutPlanController.getWorkouts.bind(workoutPlanController));
workoutPlanRouter.patch('/workouts/complete-daily', workoutPlanController.completeDailyWorkoutAndFetchReport.bind(workoutPlanController));
export default workoutPlanRouter;
//# sourceMappingURL=client.workoutPlan.routes.js.map