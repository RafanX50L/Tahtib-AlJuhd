import { Request, Response } from 'express';
import { AdminProgressService } from '@/Services/admin/admin.progress.service';

export class AdminProgressController {
  constructor(private readonly service: AdminProgressService) {}

  async cohortCompletion(req: Request, res: Response) {
    const { start, end } = req.query as any;
    const data = await this.service.cohortCompletionByDayRange({ start: new Date(start), end: new Date(end) });
    res.json({ success: true, data });
  }

  async exportHealthCsv(req: Request, res: Response) {
    const { metricType, start, end } = req.query as any;
    const csv = await this.service.exportHealthCsv({ metricType, start: start ? new Date(start) : undefined, end: end ? new Date(end) : undefined });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="health_metrics.csv"');
    res.send(csv);
  }
}


