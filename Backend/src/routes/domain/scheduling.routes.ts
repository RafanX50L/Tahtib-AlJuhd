import express from 'express';
import { verifyAnyToken, restrictTo } from '@/middleware/verify.token.middleware';
import { SchedulingService } from '../../Services/domain/Scheduling.service';

const router = express.Router();

const schedulingService = new SchedulingService();

// GET /api/trainers/:trainerId/availability?date=YYYY-MM-DD
router.get('/trainers/:trainerId/availability', verifyAnyToken(), restrictTo('client','trainer','admin'), async (req, res, next) => {
  try {
    const { trainerId } = req.params;
    const { date, tz } = req.query as { date?: string; tz?: string };
    const result = await schedulingService.getAvailabilityForDate(trainerId, date, tz);
    res.json(result);
  } catch (err) { next(err); }
});

// POST /api/bookings
router.post('/bookings', verifyAnyToken(), restrictTo('client'), async (req, res, next) => {
  try {
    const { trainerId, clientId, date, time, duration, tz } = req.body as { trainerId: string; clientId: string; date: string; time: string; duration?: number; tz?: string };
    console.log(req.body);
    const booking = await schedulingService.bookSlot({ trainerId, clientId, date, time, duration: duration || 60, tz });
    res.status(201).json(booking);
  } catch (err) { next(err); }
});

// GET /api/bookings?trainerId=ID&status=upcoming
router.get('/bookings', verifyAnyToken(), restrictTo('client','trainer','admin'), async (req, res, next) => {
  try {
    const { trainerId, clientId, status } = req.query as { trainerId?: string; clientId?: string; status?: string };
    const items = await schedulingService.listBookings({ trainerId, clientId, status });
    res.json(items);
  } catch (err) { next(err); }
});

// PATCH /api/bookings/:bookingId/cancel
router.patch('/bookings/:bookingId/cancel', verifyAnyToken(), restrictTo('client','trainer','admin'), async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const canceled = await schedulingService.cancelBooking(bookingId);
    res.json(canceled);
  } catch (err) { next(err); }
});

export default router;


