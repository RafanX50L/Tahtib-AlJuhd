import express from 'express';
import crypto from 'crypto';
import { BookingModel } from '@/models/Booking.model';
import { UserModel } from '@/models/user.model';

const router = express.Router();

// Optional: verify Calendly webhook signature if configured
function verifySignature(req: express.Request) {
  const secret = process.env.CALENDLY_WEBHOOK_SECRET;
  if (!secret) return true;
  const signature = req.headers['calendly-signature-v2'] as string | undefined;
  if (!signature) return false;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(JSON.stringify(req.body)).digest('hex');
  return signature.includes(digest);
}

router.post('/webhooks/calendly', express.json({ type: 'application/json' }), async (req, res) => {
  try {
    if (!verifySignature(req)) return res.status(401).json({ error: 'Invalid signature' });

    const { event, payload } = req.body;
    if (!event) return res.status(400).json({ error: 'Invalid payload' });

    if (event === 'invitee.created') {
      const trainerEmail: string | undefined = payload?.event?.organizer?.email || payload?.organization?.owner?.email;
      const inviteeEmail: string | undefined = payload?.invitee?.email;
      const start = payload?.event?.start_time;
      const end = payload?.event?.end_time;

      const trainer = trainerEmail ? await UserModel.findOne({ email: trainerEmail, role: 'trainer' }) : null;
      const client = inviteeEmail ? await UserModel.findOne({ email: inviteeEmail, role: 'client' }) : null;

      await BookingModel.create({
        trainerId: trainer?._id,
        clientId: client?._id,
        sessionDate: new Date(start),
        startTime: new Date(start).toISOString().slice(11, 16),
        endTime: new Date(end).toISOString().slice(11, 16),
        duration: Math.max(30, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000)),
        status: 'confirmed',
        paymentStatus: 'pending',
        amount: 0,
        currency: 'USD',
        notes: 'Calendly booking sync',
      });
    }

    if (event === 'invitee.canceled') {
      const start = req.body?.payload?.event?.start_time;
      if (start) {
        await BookingModel.updateOne({ sessionDate: new Date(start) }, { $set: { status: 'cancelled' } });
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Calendly webhook error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;


