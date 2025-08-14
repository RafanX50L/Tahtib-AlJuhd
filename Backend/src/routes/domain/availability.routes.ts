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

export default router;