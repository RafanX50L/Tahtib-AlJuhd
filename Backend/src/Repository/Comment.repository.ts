import { Model } from "mongoose";
import { BaseRepository } from "./base.repository";
import { IComment, CommentModel } from "@/models/Comment.model";

export class CommentRepository extends BaseRepository<IComment> {
  constructor(model: Model<IComment> = CommentModel) {
    super(model);
  }

  async findByPost(postId: string, limit = 50) {
    return this.model.find({ postId }).sort({ createdAt: -1 }).limit(limit);
  }
}


