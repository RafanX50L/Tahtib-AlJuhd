import { ITrainerClientContract } from "@/core/interface/model/ITrainerClientContract";
import { model, Schema } from "mongoose";

const TrainerClientContractSchema = new Schema<ITrainerClientContract>({
  trainerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  sessionsRemaining: { type: Number, required: true },
  chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true }
}, { timestamps: true });

export const TrainerClientContractModel = model<ITrainerClientContract>('TrainerClientContract', TrainerClientContractSchema);