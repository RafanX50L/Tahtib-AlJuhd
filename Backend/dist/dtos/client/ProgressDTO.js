"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressDTO = void 0;
class ProgressDTO {
    static toCurrentStatus(entry) {
        if (!entry)
            return null;
        return {
            date: entry.date.toISOString(),
            weight: entry.weight,
            height: entry.height,
            bmi: entry.bmi.toFixed(1),
            bmiCategory: entry.bmiCategory,
        };
    }
    static toGraph(points) {
        return points.map((e) => ({ date: e.date.toISOString(), weight: e.weight, bmi: e.bmi }));
    }
}
exports.ProgressDTO = ProgressDTO;
//# sourceMappingURL=ProgressDTO.js.map