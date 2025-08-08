
import { Schema, model, Document, Types } from 'mongoose';
import { hashPassword } from '../utils/bcrypt.util';

// User Interface
interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  isBlocked: boolean;
  role: 'client' | 'trainer' | 'admin';
  personalization: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  isBlocked: { type: Boolean, default: false },
  role: { type: String, enum: ['client', 'trainer', 'admin'], default: 'client' },
  personalization: { type: Schema.Types.ObjectId, ref: 'Personalization', default: null },
}, { timestamps: true });

// Pre-save hook for password hashing
UserSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await hashPassword(this.password);
  }
  next();
});

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export const UserModel = model<IUser>('User', UserSchema);
