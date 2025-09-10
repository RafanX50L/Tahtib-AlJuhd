"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityModel = void 0;
const mongoose_1 = require("mongoose");
const AvailabilitySchema = new mongoose_1.Schema({
    trainerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    slots: [{
            day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
            startTime: { type: Date, required: true },
            endTime: { type: Date, required: true },
        }],
}, { timestamps: true });
exports.AvailabilityModel = (0, mongoose_1.model)('Availability', AvailabilitySchema);
//# sourceMappingURL=Availability.model.js.map