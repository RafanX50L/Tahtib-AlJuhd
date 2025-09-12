import { AvailabilityController } from '@/Controller/domain/availability.controller';
import { restrictTo } from '@/middleware/verify.token.middleware';
import { PersonalizationRepository } from '@/Repository/personalization.repository';
import { SessionRepository } from '@/Repository/Session.repository';
import { AvailabilityService } from '@/Services/domain/availability.service';
import express from 'express';

const router = express.Router();

const personalizationRepo = new PersonalizationRepository();
const sessionRepo = new SessionRepository();
const availabilityService = new AvailabilityService(personalizationRepo, sessionRepo);
const availabilityController = new AvailabilityController(availabilityService);

router.get('/availability/slots',restrictTo('trainer','client'), availabilityController.getUnFreeSlots.bind(availabilityController));
// New: set weekly day-level rules
router.post('/availability/rules',restrictTo('trainer'), availabilityController.setWeeklyRules.bind(availabilityController));
router.get('/availability/rules',restrictTo('trainer','client'), availabilityController.getWeeklyRules.bind(availabilityController));

export default router;