import { INotification } from "@/core/interface/model/INotification.model";
import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema<INotification>({
  senderId: { type: String, required: true },
  recipientId: { type: String },
  recipientRole: { type: String },
  message: { type: String, required: true },
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

export const NotificationModel = mongoose.model<INotification>("Notification", NotificationSchema);