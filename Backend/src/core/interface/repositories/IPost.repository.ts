import { IPost } from "@/models/Post.model";
import { IBaseRepository } from "./IBase.repository";
import { Types } from "mongoose";

export interface IPostRepository extends IBaseRepository<IPost> {
    getFeedForUser(userId: Types.ObjectId, followingIds: Types.ObjectId[], limit :number, cursor?: Date):Promise<IPost[]>;
    countPosts(userId:string):Promise<number>;
}