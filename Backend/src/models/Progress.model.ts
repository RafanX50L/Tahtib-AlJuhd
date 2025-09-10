import { IProgress, IProgressEntry } from '@/core/interface/model/IProgress.model';
import { Schema, model } from 'mongoose';

const ProgressEntrySchema = new Schema<IProgressEntry>({
  date: { type: Date, required: true },
  weight: { type: Number, required: true, min: 0 },
  height: { type: Number, required: true, min: 0 },
  bmi: { type: Number, required: true, min: 0 },
  bmiCategory: { type: String, enum: ['Underweight', 'Normal', 'Overweight', 'Obese'], required: true },
});

const ProgressSchema = new Schema<IProgress>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    entries: { type: [ProgressEntrySchema], default: [] },
  },
  { timestamps: true }
);

ProgressSchema.index({ user: 1, 'entries.date': -1 });

export const ProgressModel = model<IProgress>('Progress', ProgressSchema);


