"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityService = void 0;
const SessionDTO_1 = require("../../dtos/domain/SessionDTO");
class AvailabilityService {
    _personalizationRepo;
    _sessionRepo;
    constructor(_personalizationRepo, _sessionRepo) {
        this._personalizationRepo = _personalizationRepo;
        this._sessionRepo = _sessionRepo;
    }
    /**
     * Set weekly day-level rules like Mon-Fri 09:00-18:00, with optional slotLength and bufferMinutes
     * rules example:
     * { Monday: [{ startTime: '09:00', endTime: '18:00' }], Tuesday: [...], slotLength: 30, bufferMinutes: 0 }
     */
    async setWeeklyRules(trainerId, rules) {
        if (!trainerId)
            throw new Error("Trainer ID is required");
        const trainerPers = await this._personalizationRepo.findByUserId(trainerId);
        if (!trainerPers)
            throw new Error("Trainer personalization not found");
        const trainerData = trainerPers.data;
        // Remove weeklySlots completely
        const availability = {
            weeklyRules: rules.weeklyRules,
            slotLength: rules.slotLength || 30, // in minutes, e.g., 30
            bufferMinutes: rules.bufferMinutes || 0,
            engagementType: trainerData.availability?.engagementType || "contract",
        };
        await this._personalizationRepo.updateTrainerData(trainerId, {
            ...trainerData,
            availability,
        });
    }
    async getFreeSlots(trainerId, fromDate, toDate) {
        const result = await this._sessionRepo.findFreeSlotsByTrainer(trainerId, fromDate, toDate);
        return await SessionDTO_1.SessionDto.mapToISessionData(result);
    }
    async getAllSlots(trainerId, fromDate, toDate) {
        const free = await this._sessionRepo.findFreeSlotsByTrainer(trainerId, fromDate, toDate);
        const booked = await this._sessionRepo.findUnFreeSlotsByTrainer(trainerId, fromDate, toDate);
        return [...free, ...booked].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    }
    async getWeeklyRules(trainerId) {
        const trainerPers = await this._personalizationRepo.findByUserId(trainerId);
        if (!trainerPers)
            return null;
        const trainerData = trainerPers.data;
        return trainerData?.availability || null;
    }
    async getUnFreeSlotsByTrainer(trainerId, fromDate, toDate) {
        const result = await this._sessionRepo.findUnFreeSlotsByTrainer(trainerId, fromDate, toDate);
        return await SessionDTO_1.SessionDto.mapToISessionData(result);
    }
    async getUnFreeSlotsByClient(clinetId, fromDate, toDate) {
        const result = await this._sessionRepo.findUnFreeSlotsByClient(clinetId, fromDate, toDate);
        return await SessionDTO_1.SessionDto.mapToISessionData(result);
    }
}
exports.AvailabilityService = AvailabilityService;
//# sourceMappingURL=Availability.service.js.map