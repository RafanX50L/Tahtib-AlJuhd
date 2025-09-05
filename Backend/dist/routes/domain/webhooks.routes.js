var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import crypto from 'crypto';
import { BookingModel } from '../../models/Booking.model';
import { UserModel } from '../../models/user.model';
const router = express.Router();
// Optional: verify Calendly webhook signature if configured
function verifySignature(req) {
    const secret = process.env.CALENDLY_WEBHOOK_SECRET;
    if (!secret)
        return true;
    const signature = req.headers['calendly-signature-v2'];
    if (!signature)
        return false;
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(JSON.stringify(req.body)).digest('hex');
    return signature.includes(digest);
}
router.post('/webhooks/calendly', express.json({ type: 'application/json' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    try {
        if (!verifySignature(req))
            return res.status(401).json({ error: 'Invalid signature' });
        const { event, payload } = req.body;
        if (!event)
            return res.status(400).json({ error: 'Invalid payload' });
        if (event === 'invitee.created') {
            const trainerEmail = ((_b = (_a = payload === null || payload === void 0 ? void 0 : payload.event) === null || _a === void 0 ? void 0 : _a.organizer) === null || _b === void 0 ? void 0 : _b.email) || ((_d = (_c = payload === null || payload === void 0 ? void 0 : payload.organization) === null || _c === void 0 ? void 0 : _c.owner) === null || _d === void 0 ? void 0 : _d.email);
            const inviteeEmail = (_e = payload === null || payload === void 0 ? void 0 : payload.invitee) === null || _e === void 0 ? void 0 : _e.email;
            const start = (_f = payload === null || payload === void 0 ? void 0 : payload.event) === null || _f === void 0 ? void 0 : _f.start_time;
            const end = (_g = payload === null || payload === void 0 ? void 0 : payload.event) === null || _g === void 0 ? void 0 : _g.end_time;
            const trainer = trainerEmail ? yield UserModel.findOne({ email: trainerEmail, role: 'trainer' }) : null;
            const client = inviteeEmail ? yield UserModel.findOne({ email: inviteeEmail, role: 'client' }) : null;
            yield BookingModel.create({
                trainerId: trainer === null || trainer === void 0 ? void 0 : trainer._id,
                clientId: client === null || client === void 0 ? void 0 : client._id,
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
            const start = (_k = (_j = (_h = req.body) === null || _h === void 0 ? void 0 : _h.payload) === null || _j === void 0 ? void 0 : _j.event) === null || _k === void 0 ? void 0 : _k.start_time;
            if (start) {
                yield BookingModel.updateOne({ sessionDate: new Date(start) }, { $set: { status: 'cancelled' } });
            }
        }
        return res.status(200).json({ received: true });
    }
    catch (err) {
        console.error('Calendly webhook error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}));
export default router;
//# sourceMappingURL=webhooks.routes.js.map