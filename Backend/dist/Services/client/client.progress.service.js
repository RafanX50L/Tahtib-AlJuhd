"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientProgressService = void 0;
const Progress_repository_1 = require("../../Repository/Progress.repository");
const utils_1 = require("../../utils");
const status_constant_1 = require("../../constants/status.constant");
class ClientProgressService {
    progressRepository;
    constructor(progressRepository = new Progress_repository_1.ProgressRepository()) {
        this.progressRepository = progressRepository;
    }
    calculateBmi(weightKg, heightCm) {
        const heightMeters = heightCm / 100;
        const bmiValue = weightKg > 0 && heightMeters > 0 ? weightKg / (heightMeters * heightMeters) : 0;
        const bmi = Math.round(bmiValue * 10) / 10;
        let bmiCategory = 'Normal';
        if (bmi < 18.5)
            bmiCategory = 'Underweight';
        else if (bmi < 25)
            bmiCategory = 'Normal';
        else if (bmi < 30)
            bmiCategory = 'Overweight';
        else
            bmiCategory = 'Obese';
        return { bmi, bmiCategory };
    }
    async addEntry(userId, date, weightKg, heightCm) {
        await this.progressRepository.createIfNotExists(userId);
        // Enforce: only one saved entry per calendar week
        const latest = await this.progressRepository.getLatestEntry(userId);
        if (latest) {
            const last = new Date(latest.date);
            const curr = new Date(date);
            const lastWeek = getISOWeekNumber(last);
            const currWeek = getISOWeekNumber(curr);
            if (lastWeek.year === currWeek.year && lastWeek.week === currWeek.week) {
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, 'Only one entry can be saved per week. You can preview today\'s stats without saving.');
            }
        }
        const { bmi, bmiCategory } = this.calculateBmi(weightKg, heightCm);
        const entry = {
            date,
            weight: weightKg,
            height: heightCm,
            bmi,
            bmiCategory: bmiCategory,
        };
        await this.progressRepository.addEntry(userId, entry);
    }
    async getCurrentStatus(userId) {
        const latest = await this.progressRepository.getLatestEntry(userId);
        if (!latest)
            return null;
        return {
            date: latest.date.toISOString(),
            weight: latest.weight,
            height: latest.height,
            bmi: latest.bmi.toFixed(1),
            bmiCategory: latest.bmiCategory,
        };
    }
    async getGraphData(userId, start, end) {
        const entries = await this.progressRepository.getEntriesInRange(userId, start, end);
        return entries.map((e) => ({ date: e.date.toISOString(), weight: e.weight, bmi: e.bmi }));
    }
    async previewEntry(date, weightKg, heightCm) {
        const { bmi, bmiCategory } = this.calculateBmi(weightKg, heightCm);
        return {
            date: date.toISOString(),
            weight: weightKg,
            height: heightCm,
            bmi: bmi.toFixed(1),
            bmiCategory,
        };
    }
}
exports.ClientProgressService = ClientProgressService;
function getISOWeekNumber(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return { year: date.getUTCFullYear(), week: weekNo };
}
//# sourceMappingURL=client.progress.service.js.map