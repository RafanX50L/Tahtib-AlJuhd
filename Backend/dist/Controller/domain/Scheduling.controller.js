var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class SchedulingController {
    constructor(_schedulingService) {
        this._schedulingService = _schedulingService;
    }
    getAvailabilityForDate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { trainerId } = req.params;
                const { date, tz } = req.query;
                const result = yield this._schedulingService.getAvailabilityForDate(trainerId, date, tz);
                res.json(result);
            }
            catch (err) {
                next(err);
            }
        });
    }
    bookSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { trainerId, clientId, date, time, duration, tz, contractId } = req.body;
                console.log(req.body);
                const booking = yield this._schedulingService.bookSlot({
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
        });
    }
    cancelBooking(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.params;
                const { clientId } = req.body;
                const canceled = yield this._schedulingService.cancelBooking(bookingId, clientId);
                res.json(canceled);
            }
            catch (err) {
                next(err);
            }
        });
    }
    completeBooking(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.params;
                yield this._schedulingService.completeBooking(bookingId);
                res.json("Session completed marked successfully");
            }
            catch (err) {
                next(err);
            }
        });
    }
}
//# sourceMappingURL=Scheduling.controller.js.map