"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DietPlanModel = void 0;
const mongoose_1 = require("mongoose");
const MealOptionSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    instructions: { type: String, required: true },
    videoLink: { type: String, default: 'No video available' },
});
const MealTypeSchema = new mongoose_1.Schema({
    options: [MealOptionSchema],
});
const DietPlanSchema = new mongoose_1.Schema({
    mealPlan: {
        breakfast: MealTypeSchema,
        lunch: MealTypeSchema,
        dinner: MealTypeSchema,
        snacks: MealTypeSchema,
    },
    notes: { type: String, required: false },
}, { timestamps: true });
exports.DietPlanModel = (0, mongoose_1.model)('DietPlan', DietPlanSchema);
//# sourceMappingURL=DietPlan.model.js.map