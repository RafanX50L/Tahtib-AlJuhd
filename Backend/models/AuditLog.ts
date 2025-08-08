
import { Schema, model, Document, Types } from 'mongoose';

interface IAuditLog extends Document {
  userId?: Types.ObjectId;
  action: string;
  entityType: string;
  entityId: Types.ObjectId;
  details: unknown;
  createdAt: Date;
  updatedAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  action: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: Schema.Types.ObjectId, required: true },
  details: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true });

// Index
AuditLogSchema.index({ entityType: 1, entityId: 1 });

export const AuditLogModel = model<IAuditLog>('AuditLog', AuditLogSchema);