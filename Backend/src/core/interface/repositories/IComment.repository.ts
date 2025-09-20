import { IComment } from "@/models/Comment.model";
import { IBaseRepository } from "./IBase.repository";

export interface ICommentRepository extends IBaseRepository<IComment> {
    findByPost(postId: string, limit:number, cursor?: Date): Promise<IComment[]>;
}