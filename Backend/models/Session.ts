
import { Schema, model, Document, Types } from 'mongoose';

interface ISession extends Document {
  trainerId: Types.ObjectId;
  clientId: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  date: Date;
  roomId: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>({
  trainerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  date: { type: Date, required: true },
  roomId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'completed', 'cancelled'], 
    default: 'scheduled' 
  },
}, { timestamps: true });

// Indexes
SessionSchema.index({ trainerId: 1, date: 1 });
SessionSchema.index({ clientId: 1, date: 1 });

// Validation to prevent overlapping sessions
SessionSchema.pre('save', async function (next) {
  const overlappingSessions = await this.model('Session').find({
    trainerId: this.trainerId,
    date: this.date,
    $or: [
      { startTime: { $lt: this.endTime }, endTime: { $gt: this.startTime } },
      { startTime: { $gte: this.startTime, $lte: this.endTime } },
    ],
    _id: { $ne: this._id },
  });
  if (overlappingSessions.length > 0) {
    throw new Error('Session time overlaps with an existing session.');
  }
  next();
});

export const SessionModel = model<ISession>('Session', SessionSchema);
