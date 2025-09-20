import { Model } from "mongoose";
import { BaseRepository } from "./base.repository";
import { ILike, LikeModel } from "@/models/Like.model";
import { ILikeRepository } from "@/core/interface/repositories/ILike.repository";

export class LikeRepository extends BaseRepository<ILike> implements ILikeRepository {
  constructor(model: Model<ILike> = LikeModel) {
    super(model);
  }

  async countLikes(postId: string) {
    return this.model.countDocuments({ postId });
  }
}


