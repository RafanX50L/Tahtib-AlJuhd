import { AvailabilityController } from '@/Controller/domain/Availability.Controller';
import { restrictTo } from '@/middleware/verify.token.middleware';
import { PersonalizationRepository } from '@/Repository/personalization.repository';
import { SessionRepository } from '@/Repository/Session.repository';
import { AvailabilityService } from '@/Services/domain/Availability.service';
import express from 'express';

const router = express.Router();

const personalizationRepo = new PersonalizationRepository();
const sessionRepo = new SessionRepository();
const availabilityService = new AvailabilityService(personalizationRepo, sessionRepo);
const availabilityController = new AvailabilityController(availabilityService);

router.post('/availability/',restrictTo('trainer'), availabilityController.setAvailability.bind(availabilityController));
router.get('/availability/slots',restrictTo('trainer','client'), availabilityController.getFreeSlots.bind(availabilityController));
// New: set weekly day-level rules
router.post('/availability/rules',restrictTo('trainer'), async (req, res, next) => {
  try {
    const { trainerId, rules } = req.body;
    await availabilityService.setWeeklyRules(trainerId, rules);
    res.json({ message: 'Weekly rules saved' });
  } catch (err) { next(err); }
});
router.get('/availability/rules',restrictTo('trainer','client'), async (req, res, next) => {
  try {
    const { trainerId } = req.query as { trainerId?: string };
    if (!trainerId) return res.status(400).json({ error: 'trainerId is required' });
    const rules = await availabilityService.getWeeklyRules(trainerId);
    res.json({ rules });
  } catch (err) { next(err); }
});

export default router;