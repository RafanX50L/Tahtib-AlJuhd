"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerClientContractModel = void 0;
const mongoose_1 = require("mongoose");
const TrainerClientContractSchema = new mongoose_1.Schema({
    trainerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    clientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Plan', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    sessionsRemaining: { type: Number, required: true },
    chatId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Chat', required: true }
}, { timestamps: true });
exports.TrainerClientContractModel = (0, mongoose_1.model)('TrainerClientContract', TrainerClientContractSchema);
//# sourceMappingURL=TrainerClientContract.model.js.map