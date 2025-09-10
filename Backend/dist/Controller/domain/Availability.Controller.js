"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityController = void 0;
const status_constant_1 = require("../../constants/status.constant");
class AvailabilityController {
    _availabilityService;
    constructor(_availabilityService) {
        this._availabilityService = _availabilityService;
    }
    async setAvailability(req, res, next) {
        try {
            // const { trainerId, slots } = req.body;
            console.log(req.body);
            // await this._availabilityService.setAvailability(trainerId, slots);
            res.status(status_constant_1.HttpStatus.OK).json({ message: 'Availability set and slots generated' });
        }
        catch (err) {
            next(err);
        }
    }
    ;
    async getFreeSlots(req, res, next) {
        try {
            const { trainerId, fromDate, toDate } = req.query;
            // const mode = (req.query.mode as string) || 'free';
            // const from = new Date(fromDate as string);
            // const to = new Date(toDate as string);
            // const slots = mode === 'all'
            //   ? await this._availabilityService.getAllSlots(trainerId as string, from, to)
            //   : await this._availabilityService.getFreeSlots(trainerId as string, from, to);
            const slots = await this._availabilityService.getFreeSlots(trainerId, new Date(fromDate), new Date(toDate));
            console.log("slots", slots);
            res.status(status_constant_1.HttpStatus.OK).json(slots);
        }
        catch (err) {
            next(err);
        }
    }
    ;
    async getUnFreeSlots(req, res, next) {
        try {
            const { trainerId, fromDate, toDate } = req.query;
            const role = req.user?.role;
            let slots;
            if (role === "client") {
                console.log("client");
                slots = await this._availabilityService.getUnFreeSlotsByClient(req.user.id, new Date(fromDate), new Date(toDate));
            }
            else if (role === "trainer") {
                slots = await this._availabilityService.getUnFreeSlotsByTrainer(trainerId, new Date(fromDate), new Date(toDate));
            }
            console.log("slots", slots);
            res.status(status_constant_1.HttpStatus.OK).json(slots);
        }
        catch (err) {
            next(err);
        }
    }
    ;
    async setWeeklyRules(req, res, next) {
        try {
            const { trainerId, rules } = req.body;
            await this._availabilityService.setWeeklyRules(trainerId, rules);
            res.json({ message: 'Weekly rules saved' });
        }
        catch (err) {
            next(err);
        }
    }
    ;
    async getWeeklyRules(req, res, next) {
        try {
            const { trainerId } = req.query;
            if (!trainerId)
                return res.status(400).json({ error: 'trainerId is required' });
            const rules = await this._availabilityService.getWeeklyRules(trainerId);
            res.status(status_constant_1.HttpStatus.OK).json(rules);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AvailabilityController = AvailabilityController;
//# sourceMappingURL=Availability.Controller.js.map