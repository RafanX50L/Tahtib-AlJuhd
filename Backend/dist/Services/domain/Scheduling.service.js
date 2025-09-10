"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingService = void 0;
const mongoose_1 = require("mongoose");
const date_fns_1 = require("date-fns");
const utils_1 = require("../../utils");
const status_constant_1 = require("../../constants/status.constant");
const response_message_constant_1 = require("../../constants/response-message.constant");
class SchedulingService {
    _sessionRepo;
    _personalizationRepo;
    _contractRepo;
    constructor(_sessionRepo, _personalizationRepo, _contractRepo) {
        this._sessionRepo = _sessionRepo;
        this._personalizationRepo = _personalizationRepo;
        this._contractRepo = _contractRepo;
    }
    async getAvailabilityForDate(trainerId, date) {
        const target = date ? new Date(date) : new Date();
        const from = (0, date_fns_1.startOfDay)(target);
        const to = (0, date_fns_1.endOfDay)(target);
        const busySessions = await this._sessionRepo.findUnFreeSlotsByTrainer(trainerId, from, to);
        // Fetch trainer personalization
        const trainerPers = await this._personalizationRepo.findByUserId(trainerId);
        const data = trainerPers?.data;
        const rules = data?.availability?.weeklyRules;
        const dayStr = (0, date_fns_1.format)(target, "yyyy-MM-dd");
        const weekday = (0, date_fns_1.format)(target, "EEEE");
        let windows = [];
        if (rules && rules[weekday] && Array.isArray(rules[weekday])) {
            windows = rules[weekday].map((r) => ({
                start: new Date(`${dayStr}T${r.startTime}:00`),
                end: new Date(`${dayStr}T${r.endTime}:00`),
            }));
        }
        else {
            // fallback
            const baseStart = (0, date_fns_1.set)(from, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 });
            const baseEnd = (0, date_fns_1.set)(from, { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 });
            windows = [{ start: baseStart, end: baseEnd }];
        }
        const freeTimes = [];
        const minutesIncrement = data?.availability?.slotLength || 30;
        const bufferMinutes = data?.availability?.bufferMinutes || 0;
        const now = new Date();
        for (const w of windows) {
            let cursor = w.start;
            // skip past-time slots for today
            if ((0, date_fns_1.isSameDay)(target, now) && (0, date_fns_1.isBefore)(cursor, now)) {
                const minutesDiff = Math.ceil((0, date_fns_1.differenceInMinutes)(now, cursor) / (minutesIncrement + bufferMinutes));
                cursor = (0, date_fns_1.addMinutes)(cursor, minutesDiff * (minutesIncrement + bufferMinutes));
            }
            while (((0, date_fns_1.isBefore)((0, date_fns_1.addMinutes)(cursor, minutesIncrement), w.end) ||
                (0, date_fns_1.isEqual)((0, date_fns_1.addMinutes)(cursor, minutesIncrement), w.end))) {
                const next = (0, date_fns_1.addMinutes)(cursor, minutesIncrement);
                // skip past slots again just in case
                if ((0, date_fns_1.isSameDay)(target, now) && (0, date_fns_1.isBefore)(next, now)) {
                    cursor = (0, date_fns_1.addMinutes)(next, bufferMinutes);
                    continue;
                }
                const overlap = busySessions.find((s) => cursor < s.endTime && next > s.startTime);
                if (!overlap) {
                    freeTimes.push({
                        time: (0, date_fns_1.format)(cursor, "HH:mm"),
                        duration: minutesIncrement,
                        isBooked: false,
                    });
                }
                cursor = (0, date_fns_1.addMinutes)(next, bufferMinutes);
            }
        }
        console.log("nice", { date: (0, date_fns_1.format)(target, "yyyy-MM-dd"), slots: freeTimes });
        return { date: (0, date_fns_1.format)(target, "yyyy-MM-dd"), slots: freeTimes };
    }
    async bookSlot(input) {
        const start = new Date(`${input.date}T${input.time}:00`);
        const end = (0, date_fns_1.addMinutes)(start, input.duration || 30);
        console.log("start and end", start, end);
        // Prevent double booking by checking ANY session in the range
        const dayFrom = (0, date_fns_1.startOfDay)(start);
        const dayTo = (0, date_fns_1.endOfDay)(start);
        const free = await this._sessionRepo.findFreeSlotsByTrainer(input.trainerId, dayFrom, dayTo);
        const nonFree = await this._sessionRepo.findUnFreeSlotsByTrainer(input.trainerId, dayFrom, dayTo);
        const conflicts = [...free, ...nonFree];
        const taken = conflicts.find((s) => !(end <= s.startTime || start >= s.endTime));
        if (taken)
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.CONFLICT, response_message_constant_1.HttpResponse.SLOTS_CONFLICT);
        // Create a session marked as booked
        const created = await this._sessionRepo.create({
            trainerId: new mongoose_1.Types.ObjectId(input.trainerId),
            clientId: new mongoose_1.Types.ObjectId(input.clientId),
            startTime: start,
            endTime: end,
            status: "booked",
            meetingLink: `room_${Math.random().toString(36).slice(2, 10)}`,
        });
        await this._contractRepo.decrementSessionsRemaining(input.contractId);
        console.log("created", created);
        return;
    }
    async listBookings({ trainerId, clientId, status, }) {
        const query = {};
        if (trainerId)
            query.trainerId = new mongoose_1.Types.ObjectId(trainerId);
        if (clientId)
            query.clientId = new mongoose_1.Types.ObjectId(clientId);
        if (status === "upcoming")
            query.startTime = { $gte: new Date() };
        if (status === "past")
            query.endTime = { $lt: new Date() };
        return await this._sessionRepo.findAll(query);
    }
    async cancelBooking(bookingId, clientId) {
        const session = await this._sessionRepo.findById(new mongoose_1.Types.ObjectId(bookingId));
        const contractId = (await this._personalizationRepo.findByUserId(clientId)).data.contracts;
        if (!session)
            throw new Error("Booking not found");
        session.status = "cancelled";
        session.clientId = null;
        await this._contractRepo.incrementSessionsRemaining(contractId.toString());
        await this._sessionRepo.update(session.id, session);
        return;
    }
    async completeBooking(bookingId) {
        const session = await this._sessionRepo.findById(new mongoose_1.Types.ObjectId(bookingId));
        if (!session)
            throw new Error("Booking not found");
        session.status = "completed";
        await this._sessionRepo.update(session.id, session);
        return;
    }
}
exports.SchedulingService = SchedulingService;
//# sourceMappingURL=Scheduling.service.js.map