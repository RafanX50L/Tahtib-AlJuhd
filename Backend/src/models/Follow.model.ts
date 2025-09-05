import { Schema, model, Types, Document } from "mongoose";

export interface IFollow extends Document {
  followerId: Types.ObjectId;
  followingId: Types.ObjectId;
  createdAt: Date;
}

const followSchema = new Schema<IFollow>(
  {
    followerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    followingId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export const FollowModel = model<IFollow>("Follow", followSchema);


