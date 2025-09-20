import { ILike } from "@/models/Like.model";
import { IBaseRepository } from "./IBase.repository";

export interface ILikeRepository extends IBaseRepository<ILike> {
    countLikes(postId: string):Promise<number>;
}