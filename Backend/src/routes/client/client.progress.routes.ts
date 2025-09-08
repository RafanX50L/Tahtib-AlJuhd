import { Router } from 'express';
import { ClientProgressController } from '@/Controller/client/client.progress.controller';
import { ClientProgressService } from '@/Services/client/client.progress.service';
import { WorkoutProgressRepository } from '@/Repository/WorkoutProgress.repository';
import { StreakLogRepository } from '@/Repository/StreakLog.repository';
import { HealthMetricRepository } from '@/Repository/HealthMetric.repository';
import { VideoProgressRepository } from '@/Repository/VideoProgress.repository';

const progressRouter = Router();

const workoutRepo = new WorkoutProgressRepository();
const streakRepo = new StreakLogRepository();
const healthRepo = new HealthMetricRepository();
const videoRepo = new VideoProgressRepository();
const service = new ClientProgressService(workoutRepo, streakRepo, healthRepo, videoRepo);
const controller = new ClientProgressController(service);

progressRouter.post('/progress/workout', controller.upsertWorkoutProgress.bind(controller));
progressRouter.post('/progress/health', controller.recordHealthMetric.bind(controller));
progressRouter.post('/progress/video', controller.upsertVideoProgress.bind(controller));
progressRouter.get('/progress/summary', controller.getSummary.bind(controller));
progressRouter.get('/progress/workout/day', controller.getWorkoutDayProgress.bind(controller));
progressRouter.get('/progress/health', controller.listHealthMetrics.bind(controller));
progressRouter.get('/progress/streaks', controller.getStreaks.bind(controller));
progressRouter.get('/progress/workout/recent', controller.listRecentWorkoutDays.bind(controller));

export default progressRouter;


