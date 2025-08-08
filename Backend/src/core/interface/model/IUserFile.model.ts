
import { Document, Types } from 'mongoose';

export interface IUserFile extends Document {
  userId: Types.ObjectId;
  fileName: string;
  filePath: string;
  fileType: string;
  purpose: 'profilePhoto' | 'certification' | 'resume' | 'postImage' | 'other';
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}