import { Model, Types } from "mongoose";
import { BaseRepository } from "./base.repository";
import { IFollow, FollowModel } from "@/models/Follow.model";
import { IFollowRepository } from "@/core/interface/repositories/IFollow.repository";

export class FollowRepository extends BaseRepository<IFollow> implements IFollowRepository{
  constructor(model: Model<IFollow> = FollowModel) {
    super(model);
  }

  async getFollowingIds(userId: Types.ObjectId): Promise<Types.ObjectId[]> {
    const docs = await this.model.find({ followerId: userId }, { followingId: 1, _id: 0 });
    return docs.map((d) => d.followingId as Types.ObjectId);
  }

  async isFollowing(followerId: Types.ObjectId, followingId: Types.ObjectId) {
    const existing = await this.model.findOne({ followerId, followingId });
    return !!existing;
  }

  async countFollowers(profileUserId:string){
    return await this.model.countDocuments({ followingId: profileUserId });
  }
  async countFollowing(profileUserId:string){
    return await this.model.countDocuments({ followerId: profileUserId });
  }
}


