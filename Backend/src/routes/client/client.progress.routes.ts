import { Router } from 'express';
import { ClientProgressController } from '@/Controller/client/client.progress.controller';
import { ClientProgressService } from '@/Services/client/client.progress.service';
import { ProgressRepository } from '@/Repository/Progress.repository';

const router = Router();
const controller = new ClientProgressController(new ClientProgressService(new ProgressRepository()));

router.post('/progress', controller.addEntry.bind(controller));

router.post('/progress/preview', controller.previewEntry.bind(controller));

router.get('/progress/current', controller.getCurrentStatus.bind(controller));

router.get('/progress/graph', controller.getGraphData.bind(controller));

export default router;

