import { BookingController } from '@/Controller/domain/booking.controller';
import { ChatRepository } from '@/Repository/Chat.repository';
import { PaymentCollectionRepository } from '@/Repository/PaymentCollection.repository';
import { PersonalizationRepository } from '@/Repository/personalization.repository';
import { PlanRepository } from '@/Repository/Plan.repository';
import { SessionRepository } from '@/Repository/Session.repository';
import { TrainerClientContractRepository } from '@/Repository/TrainerClientContract.repository';
import { BookingService } from '@/Services/domain/booking.service';
import express from 'express';

const router = express.Router();

const contractRepo = new TrainerClientContractRepository();
const sessionRepo = new SessionRepository();
const chatRepo = new ChatRepository();
const planRepo = new PlanRepository();
const personalizationRepo = new PersonalizationRepository();
const _paymentRepo = new PaymentCollectionRepository();
const bookingService = new BookingService(contractRepo, sessionRepo, chatRepo, planRepo, personalizationRepo, _paymentRepo);
const bookingController = new BookingController(bookingService);

// router.post('/purchase-plan', bookingController.purchasePlan.bind(bookingController));

export default router;