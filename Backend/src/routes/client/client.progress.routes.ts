import { Router } from 'express';
import { ClientProgressController } from '@/Controller/client/client.progress.controller';
import { ClientProgressService } from '@/Services/client/client.progress.service';
import { ProgressRepository } from '@/Repository/Progress.repository';

const router = Router();
const controller = new ClientProgressController(new ClientProgressService(new ProgressRepository()));

// POST /progress
router.post('/progress', controller.addEntry.bind(controller));

// POST /progress/preview (no DB write)
router.post('/progress/preview', controller.previewEntry.bind(controller));

// GET /progress/current
router.get('/progress/current', controller.getCurrentStatus.bind(controller));

// GET /progress/graph?start=...&end=...
router.get('/progress/graph', controller.getGraphData.bind(controller));

export default router;

