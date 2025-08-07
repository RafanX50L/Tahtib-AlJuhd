
import { Schema, model, Document, Types } from 'mongoose';

interface IUserFile extends Document {
  userId: Types.ObjectId;
  fileName: string;
  filePath: string;
  fileType: string;
  purpose: 'profilePhoto' | 'certification' | 'resume' | 'postImage' | 'other';
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserFileSchema = new Schema<IUserFile>({
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

export const UserFileModel = model<IUserFile>('UserFile', UserFileSchema);
