import { Schema, model, Document, Types } from 'mongoose';

interface IProgressEntry {
  date: Date;
  weight: number;
  workoutsCompleted: number;
  notes?: string;
}

interface IProgressLog extends Document {
  clientId: Types.ObjectId;
  entries: IProgressEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const ProgressEntrySchema = new Schema<IProgressEntry>({
  date: { type: Date, required: true, default: Date.now },
  weight: { type: Number, required: true },
  workoutsCompleted: { type: Number, required: true },
  notes: { type: String, required: false },
});

const ProgressLogSchema = new Schema<IProgressLog>({
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  entries: { 
    type: [ProgressEntrySchema], 
    default: [], 
    validate: [v => v.length <= 100, 'Progress entries cannot exceed 100'] 
  },
}, { timestamps: true });

// Index
ProgressLogSchema.index({ clientId: 1 });

export const ProgressLogModel = model<IProgressLog>('ProgressLog', ProgressLogSchema);