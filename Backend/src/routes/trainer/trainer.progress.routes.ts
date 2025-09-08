import { Router } from 'express';
import { TrainerProgressController } from '@/Controller/trainer/trainer.progress.controller';
import { TrainerProgressService } from '@/Services/trainer/trainer.progress.service';
import { WorkoutProgressRepository } from '@/Repository/WorkoutProgress.repository';

const trainerProgressRouter = Router();

const workoutRepo = new WorkoutProgressRepository();
const service = new TrainerProgressService(workoutRepo);
const controller = new TrainerProgressController(service);

trainerProgressRouter.post('/progress/reset', controller.resetWorkoutDay.bind(controller));
trainerProgressRouter.post('/progress/approve', controller.approveWorkoutDay.bind(controller));

export default trainerProgressRouter;


