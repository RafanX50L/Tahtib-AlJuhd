import { IFollow } from "@/models/Follow.model";
import { IBaseRepository } from "./IBase.repository";
import { Types } from "mongoose";

export interface IFollowRepository extends IBaseRepository<IFollow> {
    getFollowingIds(userId: Types.ObjectId): Promise<Types.ObjectId[]>
    isFollowing(followerId: Types.ObjectId, followingId: Types.ObjectId):Promise<boolean>;
    countFollowers(profileUserId:string):Promise<number>;
    countFollowing(profileUserId:string):Promise<number>;
}