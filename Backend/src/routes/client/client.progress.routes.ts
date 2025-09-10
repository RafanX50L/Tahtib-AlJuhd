import { Router } from 'express';
import { ClientProgressController } from '@/Controller/client/client.progress.controller';
import { ClientProgressService } from '@/Services/client/client.progress.service';

const router = Router();
const controller = new ClientProgressController(new ClientProgressService());

// POST /progress
router.post('/progress', (req, res, next) => controller.addEntry(req, res, next));

// POST /progress/preview (no DB write)
router.post('/progress/preview', (req, res, next) => controller.previewEntry(req, res, next));

// GET /progress/current
router.get('/progress/current', (req, res, next) => controller.getCurrentStatus(req as any, res, next));

// GET /progress/graph?start=...&end=...
router.get('/progress/graph', (req, res, next) => controller.getGraphData(req as any, res, next));

export default router;

