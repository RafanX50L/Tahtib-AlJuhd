var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Types } from "mongoose";
import { startOfDay, endOfDay, set, addMinutes, isBefore, 
// isAfter,
// formatISO,
format, differenceInMinutes, isSameDay, isEqual, } from "date-fns";
import { createHttpError } from "../../utils";
import { HttpStatus } from "../../constants/status.constant";
import { HttpResponse } from "../../constants/response-message.constant";
export class SchedulingService {
    constructor(_sessionRepo, _personalizationRepo, _contractRepo) {
        this._sessionRepo = _sessionRepo;
        this._personalizationRepo = _personalizationRepo;
        this._contractRepo = _contractRepo;
    }
    getAvailabilityForDate(trainerId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const target = date ? new Date(date) : new Date();
            const from = startOfDay(target);
            const to = endOfDay(target);
            const busySessions = yield this._sessionRepo.findUnFreeSlotsByTrainer(trainerId, from, to);
            // Fetch trainer personalization
            const trainerPers = yield this._personalizationRepo.findByUserId(trainerId);
            const data = trainerPers === null || trainerPers === void 0 ? void 0 : trainerPers.data;
            const rules = (_a = data === null || data === void 0 ? void 0 : data.availability) === null || _a === void 0 ? void 0 : _a.weeklyRules;
            const dayStr = format(target, "yyyy-MM-dd");
            const weekday = format(target, "EEEE");
            let windows = [];
            if (rules && rules[weekday] && Array.isArray(rules[weekday])) {
                windows = rules[weekday].map((r) => ({
                    start: new Date(`${dayStr}T${r.startTime}:00`),
                    end: new Date(`${dayStr}T${r.endTime}:00`),
                }));
            }
            else {
                // fallback
                const baseStart = set(from, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 });
                const baseEnd = set(from, { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 });
                windows = [{ start: baseStart, end: baseEnd }];
            }
            const freeTimes = [];
            const minutesIncrement = ((_b = data === null || data === void 0 ? void 0 : data.availability) === null || _b === void 0 ? void 0 : _b.slotLength) || 30;
            const bufferMinutes = ((_c = data === null || data === void 0 ? void 0 : data.availability) === null || _c === void 0 ? void 0 : _c.bufferMinutes) || 0;
            const now = new Date();
            for (const w of windows) {
                let cursor = w.start;
                // skip past-time slots for today
                if (isSameDay(target, now) && isBefore(cursor, now)) {
                    const minutesDiff = Math.ceil(differenceInMinutes(now, cursor) / (minutesIncrement + bufferMinutes));
                    cursor = addMinutes(cursor, minutesDiff * (minutesIncrement + bufferMinutes));
                }
                while ((isBefore(addMinutes(cursor, minutesIncrement), w.end) ||
                    isEqual(addMinutes(cursor, minutesIncrement), w.end))) {
                    const next = addMinutes(cursor, minutesIncrement);
                    // skip past slots again just in case
                    if (isSameDay(target, now) && isBefore(next, now)) {
                        cursor = addMinutes(next, bufferMinutes);
                        continue;
                    }
                    const overlap = busySessions.find((s) => cursor < s.endTime && next > s.startTime);
                    if (!overlap) {
                        freeTimes.push({
                            time: format(cursor, "HH:mm"),
                            duration: minutesIncrement,
                            isBooked: false,
                        });
                    }
                    cursor = addMinutes(next, bufferMinutes);
                }
            }
            console.log("nice", { date: format(target, "yyyy-MM-dd"), slots: freeTimes });
            return { date: format(target, "yyyy-MM-dd"), slots: freeTimes };
        });
    }
    bookSlot(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = new Date(`${input.date}T${input.time}:00`);
            const end = addMinutes(start, input.duration || 30);
            console.log("start and end", start, end);
            // Prevent double booking by checking ANY session in the range
            const dayFrom = startOfDay(start);
            const dayTo = endOfDay(start);
            const free = yield this._sessionRepo.findFreeSlotsByTrainer(input.trainerId, dayFrom, dayTo);
            const nonFree = yield this._sessionRepo.findUnFreeSlotsByTrainer(input.trainerId, dayFrom, dayTo);
            const conflicts = [...free, ...nonFree];
            const taken = conflicts.find((s) => !(end <= s.startTime || start >= s.endTime));
            if (taken)
                throw createHttpError(HttpStatus.CONFLICT, HttpResponse.SLOTS_CONFLICT);
            // Create a session marked as booked
            const created = yield this._sessionRepo.create({
                trainerId: new Types.ObjectId(input.trainerId),
                clientId: new Types.ObjectId(input.clientId),
                startTime: start,
                endTime: end,
                status: "booked",
                meetingLink: `room_${Math.random().toString(36).slice(2, 10)}`,
            });
            yield this._contractRepo.decrementSessionsRemaining(input.contractId);
            console.log("created", created);
            return;
        });
    }
    listBookings(_a) {
        return __awaiter(this, arguments, void 0, function* ({ trainerId, clientId, status, }) {
            const query = {};
            if (trainerId)
                query.trainerId = new Types.ObjectId(trainerId);
            if (clientId)
                query.clientId = new Types.ObjectId(clientId);
            if (status === "upcoming")
                query.startTime = { $gte: new Date() };
            if (status === "past")
                query.endTime = { $lt: new Date() };
            return yield this._sessionRepo.findAll(query);
        });
    }
    cancelBooking(bookingId, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this._sessionRepo.findById(new Types.ObjectId(bookingId));
            const contractId = (yield this._personalizationRepo.findByUserId(clientId)).data.contracts;
            if (!session)
                throw new Error("Booking not found");
            session.status = "cancelled";
            session.clientId = null;
            yield this._contractRepo.incrementSessionsRemaining(contractId.toString());
            yield this._sessionRepo.update(session.id, session);
            return;
        });
    }
    completeBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this._sessionRepo.findById(new Types.ObjectId(bookingId));
            if (!session)
                throw new Error("Booking not found");
            session.status = "completed";
            yield this._sessionRepo.update(session.id, session);
            return;
        });
    }
}
//# sourceMappingURL=Scheduling.service.js.map