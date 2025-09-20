import { Model, Types } from "mongoose";
import { BaseRepository } from "./base.repository";
import { IPost, PostModel } from "@/models/Post.model";
import { IPostRepository } from "@/core/interface/repositories/IPost.repository";

export class PostRepository extends BaseRepository<IPost> implements IPostRepository {
  constructor(model: Model<IPost> = PostModel) {
    super(model);
  }

  async getFeedForUser(userId: Types.ObjectId, followingIds: Types.ObjectId[], limit = 20, cursor?: Date) {
    const filter: Record<string, unknown> = {
    };
    if (cursor) {
      filter.createdAt = { $lt: cursor };
    }
    return this.model
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async countPosts(userId:string){
    return await this.model.countDocuments({ authorId: userId });
  }
}

  
