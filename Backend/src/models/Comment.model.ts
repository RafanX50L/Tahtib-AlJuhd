import { Schema, model, Types, Document } from "mongoose";

export interface IComment extends Document {
  postId: Types.ObjectId;
  authorId: Types.ObjectId;
  content: string;
  parentCommentId?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
    parentCommentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
  },
  { timestamps: true }
);

commentSchema.index({ postId: 1, createdAt: -1 });

export const CommentModel = model<IComment>("Comment", commentSchema);


