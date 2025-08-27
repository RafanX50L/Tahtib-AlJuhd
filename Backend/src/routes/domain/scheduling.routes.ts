import express from 'express';
import { verifyAnyToken, restrictTo } from '@/middleware/verify.token.middleware';
import { SchedulingService } from '../../Services/domain/Scheduling.service';
import { PersonalizationRepository } from '@/Repository/personalization.repository';
import { SessionRepository } from '@/Repository/Session.repository';
import { SchedulingController } from '@/Controller/domain/Scheduling.controller';
import { TrainerClientContractRepository } from '@/Repository/TrainerClientContract.repository';

const router = express.Router();

const personalizationRepo = new PersonalizationRepository();
const sessionRepo = new SessionRepository();
const contractRepo = new TrainerClientContractRepository();
const schedulingService = new SchedulingService(sessionRepo, personalizationRepo, contractRepo);
const schedulingController = new SchedulingController(schedulingService);

// GET /api/trainers/:trainerId/availability?date=YYYY-MM-DD 
router.get('/trainers/:trainerId/availability', verifyAnyToken(), restrictTo('client','trainer','admin'), schedulingController.getAvailabilityForDate.bind(schedulingController));

// POST /api/bookings 
router.post('/bookings', verifyAnyToken(), restrictTo('client'), schedulingController.bookSlot.bind(schedulingController));

// GET /api/bookings?trainerId=ID&status=upcoming 
router.get('/bookings', verifyAnyToken(), restrictTo('client','trainer','admin'), schedulingController.listBookings.bind(schedulingController));

// PATCH /api/bookings/:bookingId/cancel
router.patch('/bookings/:bookingId/cancel', verifyAnyToken(), restrictTo('client','trainer','admin'), schedulingController.cancelBooking.bind(schedulingController));

export default router;


