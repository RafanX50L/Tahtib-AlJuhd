import express from 'express';
import { verifyAnyToken, restrictTo } from '@/middleware/verify.token.middleware';
import { SchedulingService } from '../../Services/domain/scheduling.service';
import { PersonalizationRepository } from '@/Repository/personalization.repository';
import { SessionRepository } from '@/Repository/Session.repository';
import { SchedulingController } from '@/Controller/domain/scheduling.controller';
import { TrainerClientContractRepository } from '@/Repository/TrainerClientContract.repository';

const router = express.Router();

const personalizationRepo = new PersonalizationRepository();
const sessionRepo = new SessionRepository();
const contractRepo = new TrainerClientContractRepository();
const schedulingService = new SchedulingService(sessionRepo, personalizationRepo, contractRepo);
const schedulingController = new SchedulingController(schedulingService);

router.get('/trainers/:trainerId/availability', verifyAnyToken(), restrictTo('client','trainer','admin'), schedulingController.getAvailabilityForDate.bind(schedulingController));

router.post('/bookings', verifyAnyToken(), restrictTo('client'), schedulingController.bookSlot.bind(schedulingController));

router.get('/bookings', verifyAnyToken(), restrictTo('client','trainer','admin'), schedulingController.listBookings.bind(schedulingController));

router.patch('/bookings/:bookingId/cancel', verifyAnyToken(), restrictTo('client','trainer','admin'), schedulingController.cancelBooking.bind(schedulingController));
router.patch('/bookings/:bookingId/complete', verifyAnyToken(), restrictTo('client','trainer','admin'), schedulingController.completeBooking.bind(schedulingController));

export default router;


