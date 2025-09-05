var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpStatus } from '../../constants/status.constant';
export class AvailabilityController {
    constructor(_availabilityService) {
        this._availabilityService = _availabilityService;
    }
    setAvailability(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const { trainerId, slots } = req.body;
                console.log(req.body);
                // await this._availabilityService.setAvailability(trainerId, slots);
                res.status(HttpStatus.OK).json({ message: 'Availability set and slots generated' });
            }
            catch (err) {
                next(err);
            }
        });
    }
    ;
    getFreeSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { trainerId, fromDate, toDate } = req.query;
                // const mode = (req.query.mode as string) || 'free';
                // const from = new Date(fromDate as string);
                // const to = new Date(toDate as string);
                // const slots = mode === 'all'
                //   ? await this._availabilityService.getAllSlots(trainerId as string, from, to)
                //   : await this._availabilityService.getFreeSlots(trainerId as string, from, to);
                const slots = yield this._availabilityService.getFreeSlots(trainerId, new Date(fromDate), new Date(toDate));
                console.log("slots", slots);
                res.status(HttpStatus.OK).json(slots);
            }
            catch (err) {
                next(err);
            }
        });
    }
    ;
    getUnFreeSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { trainerId, fromDate, toDate } = req.query;
                const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
                let slots;
                if (role === "client") {
                    console.log("client");
                    slots = yield this._availabilityService.getUnFreeSlotsByClient(req.user.id, new Date(fromDate), new Date(toDate));
                }
                else if (role === "trainer") {
                    slots = yield this._availabilityService.getUnFreeSlotsByTrainer(trainerId, new Date(fromDate), new Date(toDate));
                }
                console.log("slots", slots);
                res.status(HttpStatus.OK).json(slots);
            }
            catch (err) {
                next(err);
            }
        });
    }
    ;
    setWeeklyRules(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { trainerId, rules } = req.body;
                yield this._availabilityService.setWeeklyRules(trainerId, rules);
                res.json({ message: 'Weekly rules saved' });
            }
            catch (err) {
                next(err);
            }
        });
    }
    ;
    getWeeklyRules(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { trainerId } = req.query;
                if (!trainerId)
                    return res.status(400).json({ error: 'trainerId is required' });
                const rules = yield this._availabilityService.getWeeklyRules(trainerId);
                res.status(HttpStatus.OK).json(rules);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
//# sourceMappingURL=Availability.Controller.js.map