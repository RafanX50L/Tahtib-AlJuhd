import { Schema, model } from 'mongoose';
const UserFileSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Personalization', required: true },
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
export const UserFileModel = model('UserFile', UserFileSchema);
//# sourceMappingURL=UserFile.model.js.map