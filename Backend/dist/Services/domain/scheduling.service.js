"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingService = void 0;
const mongoose_1 = require("mongoose");
const date_fns_1 = require("date-fns");
const utils_1 = require("../../utils");
const status_constant_1 = require("../../constants/status.constant");
const response_message_constant_1 = require("../../constants/response-message.constant");
const SessionDTO_1 = require("../../dtos/domain/SessionDTO");
const timezone_utils_1 = require("../../utils/timezone.utils");
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
        // Fetch trainer personalization to get timezone
        const trainerPers = await this._personalizationRepo.findByUserId(trainerId);
        const data = trainerPers?.data;
        // Get timezone from availability data first, fallback to basicInfo
        const trainerTimezone = data?.availability?.timezone || data?.basicInfo?.timeZone;
        if (!trainerTimezone) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, "Trainer timezone not found");
        }
        // Get day bounds in UTC based on trainer's timezone
        const { start: from, end: to } = (0, timezone_utils_1.getDayBoundsInUTC)(target, trainerTimezone);
        const busySessions = await this._sessionRepo.findUnFreeSlotsByTrainer(trainerId, from, to);
        const rules = data?.availability?.weeklyRules;
        const weekday = (0, date_fns_1.format)(target, "EEEE");
        let windows = [];
        if (rules && rules[weekday] && Array.isArray(rules[weekday])) {
            // Create time windows in UTC using trainer's timezone
            windows = (0, timezone_utils_1.createTimeWindowsFromRules)(rules, target, trainerTimezone);
        }
        else {
            // No rules → no slots
            return { date: (0, date_fns_1.format)(target, "yyyy-MM-dd"), slots: [] };
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
            while ((0, date_fns_1.isBefore)((0, date_fns_1.addMinutes)(cursor, minutesIncrement), w.end) ||
                (0, date_fns_1.isEqual)((0, date_fns_1.addMinutes)(cursor, minutesIncrement), w.end)) {
                const next = (0, date_fns_1.addMinutes)(cursor, minutesIncrement);
                // skip past slots again just in case
                if ((0, date_fns_1.isSameDay)(target, now) && (0, date_fns_1.isBefore)(next, now)) {
                    cursor = (0, date_fns_1.addMinutes)(next, bufferMinutes);
                    continue;
                }
                const overlap = busySessions.find((s) => cursor < s.endTime && next > s.startTime);
                if (!overlap) {
                    // Convert UTC time back to trainer's timezone for display
                    const localTime = (0, timezone_utils_1.utcToLocalTime)(cursor, trainerTimezone);
                    freeTimes.push({
                        time: localTime,
                        duration: minutesIncrement,
                        isBooked: false,
                    });
                }
                cursor = (0, date_fns_1.addMinutes)(next, bufferMinutes);
            }
        }
        return { date: (0, date_fns_1.format)(target, "yyyy-MM-dd"), slots: freeTimes };
    }
    async bookSlot(input) {
        // Get trainer's timezone for proper conversion
        // const weeklyCount = await this._sessionRepo.coutnCancelledDocumentsInAWeek(input.clientId);
        // if(weeklyCount>=3){
        //   throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.USER_ALREADY_CANCELLED_MORE_THAN_THREE);
        // }
        const trainerPers = await this._personalizationRepo.findByUserId(input.trainerId);
        const data = trainerPers?.data;
        // Get timezone from availability data first, fallback to basicInfo
        const trainerTimezone = data?.availability?.timezone || data?.basicInfo?.timeZone;
        if (!trainerTimezone) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, "Trainer timezone not found");
        }
        const targetDate = new Date(input.date);
        // Convert local time to UTC using trainer's timezone
        const start = (0, timezone_utils_1.localTimeToUTC)(input.time, targetDate, trainerTimezone);
        const end = (0, date_fns_1.addMinutes)(start, input.duration || 30);
        // Prevent double booking by checking ANY session in the range
        // Use UTC day bounds for consistency
        const dayFrom = (0, date_fns_1.startOfDay)(start);
        const dayTo = (0, date_fns_1.endOfDay)(start);
        const free = await this._sessionRepo.findFreeSlotsByTrainer(input.trainerId, dayFrom, dayTo);
        const nonFree = await this._sessionRepo.findUnFreeSlotsByTrainer(input.trainerId, dayFrom, dayTo);
        const conflicts = [...free, ...nonFree];
        const taken = conflicts.find((s) => !(end <= s.startTime || start >= s.endTime));
        if (taken)
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.CONFLICT, response_message_constant_1.HttpResponse.SLOTS_CONFLICT);
        // Create a session marked as booked
        await this._sessionRepo.create({
            trainerId: new mongoose_1.Types.ObjectId(input.trainerId),
            clientId: new mongoose_1.Types.ObjectId(input.clientId),
            startTime: start,
            endTime: end,
            status: "booked",
            meetingLink: `room_${Math.random().toString(36).slice(2, 10)}`,
        });
        await this._contractRepo.decrementSessionsRemaining(input.contractId);
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
        const result = await this._sessionRepo.findAll(query);
        // Get trainer timezone for time conversion
        let trainerTimezone = 'UTC';
        if (trainerId) {
            const trainerPers = await this._personalizationRepo.findByUserId(trainerId);
            const data = trainerPers?.data;
            trainerTimezone = data?.availability?.timezone || data?.basicInfo?.timeZone || 'UTC';
        }
        return SessionDTO_1.SessionDto.mapToISessionData(result, trainerTimezone);
    }
    async cancelBooking(bookingId, clientId) {
        const session = await this._sessionRepo.findById(new mongoose_1.Types.ObjectId(bookingId));
        const contractId = (await this._personalizationRepo.findByUserId(clientId))
            .data.contracts;
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