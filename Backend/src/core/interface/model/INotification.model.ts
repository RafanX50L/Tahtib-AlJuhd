import { Document } from "mongoose";

export interface INotification extends Document {
  senderId: string;
  recipientId?: string; // Optional for role-based notifications
  recipientRole?: string; // E.g., "client", "trainer", "admin"
  message: string;
  type: string; // E.g., "new_message", "session_request", "approval"
  createdAt: Date;
  read: boolean;
};