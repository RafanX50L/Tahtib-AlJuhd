import { Schema, model, Types, Document } from "mongoose";

export interface IPost extends Document {
  authorId: Types.ObjectId;
  caption?: string;
  media: Array<{
    key: string; // S3 key
    type: "image" | "video";
    mimeType: string;
  }>;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema(
  {
    key: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], required: true },
    mimeType: { type: String, required: true },
  },
  { _id: false }
);

const postSchema = new Schema<IPost>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    caption: { type: String, trim: true, maxlength: 2200 },
    media: { type: [mediaSchema], default: [] },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.index({ authorId: 1, createdAt: -1 });

export const PostModel = model<IPost>("Post", postSchema);


