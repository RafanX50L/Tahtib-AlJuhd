import { Schema, model, Types, Document } from "mongoose";

export interface ILike extends Document {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

export const LikeModel = model<ILike>("Like", likeSchema);


