import { BookingController } from '@/Controller/domain/Booking.controller';
import { ChatRepository } from '@/Repository/Chat.repository';
import { PersonalizationRepository } from '@/Repository/personalization.repository';
import { PlanRepository } from '@/Repository/Plan.repository';
import { SessionRepository } from '@/Repository/Session.repository';
import { TrainerClientContractRepository } from '@/Repository/TrainerClientContract.repository';
import { BookingService } from '@/Services/domain/Booking.service';
import express from 'express';

const router = express.Router();

const contractRepo = new TrainerClientContractRepository();
const sessionRepo = new SessionRepository();
const chatRepo = new ChatRepository();
const planRepo = new PlanRepository();
const personalizationRepo = new PersonalizationRepository();
const bookingService = new BookingService(contractRepo, sessionRepo, chatRepo, planRepo, personalizationRepo);
const bookingController = new BookingController(bookingService);

router.post('/purchase', bookingController.purchasePlan);
router.post('/book', bookingController.bookSlot);
router.post('/cancel/:sessionId', bookingController.cancelSession);

export default router;