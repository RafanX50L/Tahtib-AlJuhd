"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFileModel = void 0;
const mongoose_1 = require("mongoose");
const UserFileSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Personalization', required: true },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileType: { type: String, required: true },
    purpose: {
        type: String,
        enum: ['profilePhoto', 'certification', 'resume', 'postImage', 'other'],
        required: true
    },
    uploadedAt: { type: Date, default: Date.now },
}, { timestamps: true });
// Index for faster queries
UserFileSchema.index({ userId: 1, purpose: 1 });
exports.UserFileModel = (0, mongoose_1.model)('UserFile', UserFileSchema);
//# sourceMappingURL=UserFile.model.js.map