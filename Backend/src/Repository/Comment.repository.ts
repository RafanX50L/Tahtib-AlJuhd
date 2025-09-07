import { Model } from "mongoose";
import { BaseRepository } from "./base.repository";
import { IComment, CommentModel } from "@/models/Comment.model";
import { ICommentRepository } from "@/core/interface/repositories/IComment.repository";

export class CommentRepository extends BaseRepository<IComment> implements ICommentRepository{
  constructor(model: Model<IComment> = CommentModel) {
    super(model);
  }

  async findByPost(postId: string, limit = 50, cursor?: Date) {
    const filter: Record<string, unknown> = { postId };
    if (cursor) {
      filter.createdAt = { $lt: cursor };
    }
    return this.model.find(filter).sort({ createdAt: -1 }).limit(limit);
  }
}


