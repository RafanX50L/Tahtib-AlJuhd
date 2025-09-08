import { Request, Response } from 'express';
import { TrainerProgressService } from '@/Services/trainer/trainer.progress.service';

export class TrainerProgressController {
  constructor(private readonly service: TrainerProgressService) {}

  async resetWorkoutDay(req: Request, res: Response) {
    const { userId, workoutPlanId, weekKey, dayKey } = req.body;
    const data = await this.service.resetWorkoutDay({ userId, workoutPlanId, weekKey, dayKey });
    res.json({ success: true, data });
  }

  async approveWorkoutDay(req: Request, res: Response) {
    const { userId, workoutPlanId, weekKey, dayKey } = req.body;
    const data = await this.service.approveWorkoutDay({ userId, workoutPlanId, weekKey, dayKey });
    res.json({ success: true, data });
  }
}


