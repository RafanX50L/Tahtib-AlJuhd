import { Types } from "mongoose";
import { SearchUserDTO, PostDTO, CommentDTO, ProfileDTO } from "@/dtos/shared/CommunityDTO";

export interface ICommunityService {
  createPost(
    authorId: string,
    caption: string | undefined,
    files: Express.Multer.File[]
  ): Promise<PostDTO>;

  searchUsers(
    query: string,
    currentUserId?: string,
    cursor?: string
  ): Promise<SearchUserDTO[]>;

  getFeed(
    userId: string,
    cursor?: string
  ): Promise<PostDTO[]>;

  getUserPosts(
    profileUserId: string,
    cursor?: string
  ): Promise<PostDTO[]>;

  addComment(
    userId: string,
    postId: string,
    content: string,
    parentCommentId?: string
  ): Promise<CommentDTO>;

  listComments(
    postId: string,
    cursor?: string
  ): Promise<CommentDTO[]>;

  toggleLike(
    userId: string,
    postId: string
  ): Promise<{ liked: boolean }>;

  follow(
    userId: string,
    targetUserId: string
  ): Promise<{ following: boolean }>;

  unfollow(
    userId: string,
    targetUserId: string
  ): Promise<{ following: boolean }>;

  getUserProfile(
    profileUserId: string,
    viewerUserId?: string
  ): Promise<ProfileDTO | null>;
}