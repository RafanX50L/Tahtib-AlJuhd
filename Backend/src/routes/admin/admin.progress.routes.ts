import { Router } from 'express';
import { AdminProgressController } from '@/Controller/admin/admin.progress.controller';
import { AdminProgressService } from '@/Services/admin/admin.progress.service';
import { WorkoutProgressRepository } from '@/Repository/WorkoutProgress.repository';
import { HealthMetricRepository } from '@/Repository/HealthMetric.repository';

const adminProgressRouter = Router();

const workoutRepo = new WorkoutProgressRepository();
const healthRepo = new HealthMetricRepository();
const service = new AdminProgressService(workoutRepo as any, healthRepo as any);
const controller = new AdminProgressController(service);

adminProgressRouter.get('/progress/analytics/cohort', controller.cohortCompletion.bind(controller));
adminProgressRouter.get('/progress/export/health.csv', controller.exportHealthCsv.bind(controller));

export default adminProgressRouter;


