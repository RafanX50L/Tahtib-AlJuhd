var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SessionDto } from '../../dtos/domain/SessionDTO';
export class AvailabilityService {
    constructor(_personalizationRepo, _sessionRepo) {
        this._personalizationRepo = _personalizationRepo;
        this._sessionRepo = _sessionRepo;
    }
    /**
     * Set weekly day-level rules like Mon-Fri 09:00-18:00, with optional slotLength and bufferMinutes
     * rules example:
     * { Monday: [{ startTime: '09:00', endTime: '18:00' }], Tuesday: [...], slotLength: 30, bufferMinutes: 0 }
     */
    setWeeklyRules(trainerId, rules) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!trainerId)
                throw new Error("Trainer ID is required");
            const trainerPers = yield this._personalizationRepo.findByUserId(trainerId);
            if (!trainerPers)
                throw new Error("Trainer personalization not found");
            const trainerData = trainerPers.data;
            // Remove weeklySlots completely
            const availability = {
                weeklyRules: rules.weeklyRules,
                slotLength: rules.slotLength || 30, // in minutes, e.g., 30
                bufferMinutes: rules.bufferMinutes || 0,
                engagementType: ((_a = trainerData.availability) === null || _a === void 0 ? void 0 : _a.engagementType) || "contract",
            };
            yield this._personalizationRepo.updateTrainerData(trainerId, Object.assign(Object.assign({}, trainerData), { availability }));
        });
    }
    getFreeSlots(trainerId, fromDate, toDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._sessionRepo.findFreeSlotsByTrainer(trainerId, fromDate, toDate);
            return yield SessionDto.mapToISessionData(result);
        });
    }
    getAllSlots(trainerId, fromDate, toDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const free = yield this._sessionRepo.findFreeSlotsByTrainer(trainerId, fromDate, toDate);
            const booked = yield this._sessionRepo.findUnFreeSlotsByTrainer(trainerId, fromDate, toDate);
            return [...free, ...booked].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
        });
    }
    getWeeklyRules(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const trainerPers = yield this._personalizationRepo.findByUserId(trainerId);
            if (!trainerPers)
                return null;
            const trainerData = trainerPers.data;
            return (trainerData === null || trainerData === void 0 ? void 0 : trainerData.availability) || null;
        });
    }
    getUnFreeSlotsByTrainer(trainerId, fromDate, toDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._sessionRepo.findUnFreeSlotsByTrainer(trainerId, fromDate, toDate);
            return yield SessionDto.mapToISessionData(result);
        });
    }
    getUnFreeSlotsByClient(clinetId, fromDate, toDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._sessionRepo.findUnFreeSlotsByClient(clinetId, fromDate, toDate);
            return yield SessionDto.mapToISessionData(result);
        });
    }
}
//# sourceMappingURL=Availability.service.js.map