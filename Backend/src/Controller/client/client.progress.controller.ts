import { Request, Response } from 'express';
import { ClientProgressService } from '@/Services/client/client.progress.service';

export class ClientProgressController {
  constructor(private readonly service: ClientProgressService) {}

  async upsertWorkoutProgress(req: Request, res: Response) {
    const userId = (req as any).user?.id || (req as any).user?._id || req.body.userId;
    const { workoutPlanId, weekKey, dayKey, exercises } = req.body;
    const data = await this.service.upsertWorkoutProgress({ userId, workoutPlanId, weekKey, dayKey, exercises });
    res.json({ success: true, data });
  }

  async recordHealthMetric(req: Request, res: Response) {
    const userId = (req as any).user?.id || (req as any).user?._id || req.body.userId;
    const { metricType, value, recordedAt } = req.body;
    const data = await this.service.recordHealthMetric({ userId, metricType, value, recordedAt });
    res.json({ success: true, data });
  }

  async upsertVideoProgress(req: Request, res: Response) {
    const userId = (req as any).user?.id || (req as any).user?._id || req.body.userId;
    const { videoId, watchPercent, avgPlaybackRate } = req.body;
    const data = await this.service.upsertVideoProgress({ userId, videoId, watchPercent, avgPlaybackRate });
    res.json({ success: true, data });
  }

  async getSummary(req: Request, res: Response) {
    const userId = (req as any).user?.id || (req as any).user?._id || req.query.userId as string;
    const data = await this.service.getSummary(userId);
    res.json({ success: true, data });
  }

  async getWorkoutDayProgress(req: Request, res: Response) {
    const userId = (req as any).user?.id || (req as any).user?._id || (req.query.userId as string);
    const { workoutPlanId, weekKey, dayKey } = req.query as any;
    const data = await this.service.getWorkoutDayProgress({ userId, workoutPlanId, weekKey, dayKey });
    res.json({ success: true, data });
  }

  async listHealthMetrics(req: Request, res: Response) {
    const userId = (req as any).user?.id || (req as any).user?._id || (req.query.userId as string);
    const metricType = req.query.metricType as any;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const data = await this.service.listHealthMetrics({ userId, metricType, limit });
    res.json({ success: true, data });
  }

  async getStreaks(req: Request, res: Response) {
    const userId = (req as any).user?.id || (req as any).user?._id || (req.query.userId as string);
    const data = await this.service.getStreaks(userId);
    res.json({ success: true, data });
  }

  async listRecentWorkoutDays(req: Request, res: Response) {
    const userId = (req as any).user?.id || (req as any).user?._id || (req.query.userId as string);
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const data = await this.service.listRecentWorkoutDays(userId, limit);
    res.json({ success: true, data });
  }
}


