import { NextFunction, Response } from "express";
import { AddedRequest } from "@/middleware/verify.token.middleware";

export interface ICommunityController {
  createPost(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
  getFeed(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
  getUserPosts(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
  searchUsers(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
  addComment(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
  listComments(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
  getPost(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
  toggleLike(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
  follow(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
  unfollow(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
  getUserProfile(req: AddedRequest, res: Response, next: NextFunction): Promise<void>;
}