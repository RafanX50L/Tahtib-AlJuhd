"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanModel = void 0;
const mongoose_1 = require("mongoose");
const PlanSchema = new mongoose_1.Schema({
    trainerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    title: String,
    description: String,
    price: Number,
    sessionsPerWeek: Number,
    durationWeeks: Number,
    isActive: { type: Boolean, default: true },
    isBooked: { type: Boolean, default: false },
}, { timestamps: true });
exports.PlanModel = (0, mongoose_1.model)('Plan', PlanSchema);
//# sourceMappingURL=Plan.model.js.map