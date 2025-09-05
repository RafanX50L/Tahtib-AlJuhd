import { Model } from "mongoose";
import { BaseRepository } from "./base.repository";
import { ILike, LikeModel } from "@/models/Like.model";

export class LikeRepository extends BaseRepository<ILike> {
  constructor(model: Model<ILike> = LikeModel) {
    super(model);
  }

  async countLikes(postId: string) {
    return this.model.countDocuments({ postId });
  }
}


