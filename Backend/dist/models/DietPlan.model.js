import { Schema, model } from 'mongoose';
const MealOptionSchema = new Schema({
    name: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    instructions: { type: String, required: true },
    videoLink: { type: String, default: 'No video available' },
});
const MealTypeSchema = new Schema({
    options: [MealOptionSchema],
});
const DietPlanSchema = new Schema({
    mealPlan: {
        breakfast: MealTypeSchema,
        lunch: MealTypeSchema,
        dinner: MealTypeSchema,
        snacks: MealTypeSchema,
    },
    notes: { type: String, required: false },
}, { timestamps: true });
export const DietPlanModel = model('DietPlan', DietPlanSchema);
//# sourceMappingURL=DietPlan.model.js.map