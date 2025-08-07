
import { Schema, model, Document, Types } from 'mongoose';

interface IComment {
  userId: Types.ObjectId;
  content: string;
  createdAt: Date;
}

interface IPost extends Document {
  userId: Types.ObjectId;
  role: 'client' | 'trainer';
  content: string;
  imageId?: Types.ObjectId;
  comments: IComment[];
  likes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new Schema<IPost>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['client', 'trainer'], required: true },
  content: { type: String, required: true },
  imageId: { type: Schema.Types.ObjectId, ref: 'UserFile', required: false },
  comments: { type: [CommentSchema], default: [] },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
}, { timestamps: true });

// Indexes
PostSchema.index({ userId: 1, createdAt: -1 });
PostSchema.index({ role: 1 });

export const PostModel = model<IPost>('Post', PostSchema);
