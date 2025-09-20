import { IPaymentCollection } from "@/core/interface/model/IPaymentCollection";
import mongoose, { Schema } from "mongoose";

const PaymentCollectionSchema = new Schema<IPaymentCollection>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    trainerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    contractId: {
      type: Schema.Types.ObjectId,
      ref: 'TrainerClientContract',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'inr',
      required: true,
    },
    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    stripeSessionId: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    companyAccount: {
      type: String,
      required: true,
      default: 'company_main_account',
    },
  },
  {
    timestamps: true,
  }
);

export const PaymentCollection = mongoose.model<IPaymentCollection>(
  "PaymentCollection",
  PaymentCollectionSchema
);