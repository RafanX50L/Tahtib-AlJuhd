"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressModel = void 0;
const mongoose_1 = require("mongoose");
const ProgressEntrySchema = new mongoose_1.Schema({
    date: { type: Date, required: true },
    weight: { type: Number, required: true, min: 0 },
    height: { type: Number, required: true, min: 0 },
    bmi: { type: Number, required: true, min: 0 },
    bmiCategory: { type: String, enum: ['Underweight', 'Normal', 'Overweight', 'Obese'], required: true },
});
const ProgressSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    entries: { type: [ProgressEntrySchema], default: [] },
}, { timestamps: true });
ProgressSchema.index({ user: 1, 'entries.date': -1 });
exports.ProgressModel = (0, mongoose_1.model)('Progress', ProgressSchema);
//# sourceMappingURL=Progress.model.js.map