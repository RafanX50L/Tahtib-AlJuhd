"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingController = void 0;
class SchedulingController {
    _schedulingService;
    constructor(_schedulingService) {
        this._schedulingService = _schedulingService;
    }
    async getAvailabilityForDate(req, res, next) {
        try {
            const { trainerId } = req.params;
            const { date, tz } = req.query;
            const result = await this._schedulingService.getAvailabilityForDate(trainerId, date, tz);
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    }
    async bookSlot(req, res, next) {
        try {
            const { trainerId, clientId, date, time, duration, tz, contractId } = req.body;
            console.log(req.body);
            const booking = await this._schedulingService.bookSlot({
                trainerId,
                clientId,
                date,
                time,
                duration: duration || 60,
                tz,
                contractId,
            });
            res.status(201).json(booking);
        }
        catch (err) {
            next(err);
        }
    }
    async cancelBooking(req, res, next) {
        try {
            const { bookingId } = req.params;
            const { clientId } = req.body;
            const canceled = await this._schedulingService.cancelBooking(bookingId, clientId);
            res.json(canceled);
        }
        catch (err) {
            next(err);
        }
    }
    async completeBooking(req, res, next) {
        try {
            const { bookingId } = req.params;
            await this._schedulingService.completeBooking(bookingId);
            res.json("Session completed marked successfully");
        }
        catch (err) {
            next(err);
        }
    }
}
exports.SchedulingController = SchedulingController;
//# sourceMappingURL=Scheduling.controller.js.map