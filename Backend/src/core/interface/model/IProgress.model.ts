import { Document, Types } from 'mongoose';

export interface IProgressEntry {
  date: Date;
  weight: number; // kilograms
  height: number; // centimeters
  bmi: number;
  bmiCategory: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
}

export interface IProgress extends Document {
  user: Types.ObjectId;
  entries: IProgressEntry[];
  createdAt: Date;
  updatedAt: Date;
}


