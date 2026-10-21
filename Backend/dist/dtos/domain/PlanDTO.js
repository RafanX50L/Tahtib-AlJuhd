"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanDto = void 0;
class PlanDto {
    static async mapToPlanData(raw) {
        return {
            id: raw._id.toString(),
            trainer: raw.trainerId.toString(),
            title: raw.title,
            description: raw.description,
            price: raw.price,
            sessionsPerWeek: raw.sessionsPerWeek,
            durationWeeks: raw.durationWeeks,
            isActive: raw.isActive,
            isBooked: raw.isBooked,
            createdAt: raw.createdAt?.toISOString(),
        };
    }
}
exports.PlanDto = PlanDto;
//# sourceMappingURL=PlanDTO.js.map