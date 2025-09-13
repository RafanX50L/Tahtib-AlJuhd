import { NextFunction, Response } from "express";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { createHttpError } from "@/utils";
import { ICommunityService } from "@/core/interface/services/shared/ICommunity.service";
import { ICommunityController } from "@/core/interface/controllers/shared/ICommunity.Controller";
import { HttpStatus } from "@/constants/status.constant";

export class CommunityController implements ICommunityController {
  constructor(private readonly _communityService: ICommunityService) {}

  async createPost(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw createHttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
      const files = (req.files as Express.Multer.File[]) || [];
      if (!files.length) throw createHttpError(HttpStatus.BAD_REQUEST, "No media uploaded");
      const { caption } = req.body as { caption?: string };
      const post = await this._communityService.createPost(userId, caption, files);
      res.status(HttpStatus.CREATED).json(post);
    } catch (err) {
      next(err);
    }
  }

  async getFeed(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw createHttpError(401, "Unauthorized");
      const { cursor } = req.query as { cursor?: string };
      const posts = await this._communityService.getFeed(userId, cursor);
      
      // Check if there are more posts to load
      const hasMore = posts.length === 20;
      const nextCursor = posts.length > 0 ? posts[posts.length - 1].createdAt : undefined;
      
      res.status(HttpStatus.OK).json({ posts, hasMore, nextCursor });
    } catch (err) {
      next(err);
    }
  }

  async getUserPosts(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const { authorId } = req.params as { authorId: string };
      const { cursor } = req.query as { cursor?: string };
      const userId = req.user?.id;
      const posts = await this._communityService.getUserPosts(authorId, cursor, userId);
      res.json({ posts });
    } catch (err) {
      next(err);
    }
  }

  async searchUsers(req: AddedRequest, res: Response, next: NextFunction):Promise<void> {
    try {
      const { q, cursor } = req.query as { q?: string; cursor?: string };
      if (!q || q.trim().length < 2){
        res.status(HttpStatus.BAD_REQUEST).json({ users: [], hasMore: false, nextCursor: undefined });
        return;
      }
      const currentUserId = req.user?.id;
      const users = await this._communityService.searchUsers(q.trim(), currentUserId, cursor);
      
      // Check if there are more users to load
      const hasMore = users.length === 20;
      const nextCursor = users.length > 0 ? users[users.length - 1]._id : undefined;
      
      res.status(HttpStatus.OK).json({ users, hasMore, nextCursor });
    } catch (err) {
      next(err);
    }
  }

  async addComment(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw createHttpError(401, "Unauthorized");
      const { postId } = req.params as { postId: string };
      const { content, parentCommentId } = req.body as { content: string; parentCommentId?: string };
      const comment = await this._communityService.addComment(userId, postId, content, parentCommentId);
      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  }

  async listComments(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params as { postId: string };
      const { cursor } = req.query as { cursor?: string };
      const comments = await this._communityService.listComments(postId, cursor);
      
      // Check if there are more comments to load
      const hasMore = comments.length === 20;
      const nextCursor = comments.length > 0 ? comments[comments.length - 1].createdAt : undefined;
      
      res.json({ comments, hasMore, nextCursor });
    } catch (err) {
      next(err);
    }
  }

  async getPost(req: AddedRequest, res: Response, next: NextFunction):Promise<void> {
    try {
      const { postId } = req.params as { postId: string };
      const userId = req.user?.id;
      const post = await this._communityService.getPostById(postId, userId);
      res.json(post);
    } catch (err) {
      next(err);
    }
  }

  async toggleLike(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw createHttpError(401, "Unauthorized");
      const { postId } = req.params as { postId: string };
      const result = await this._communityService.toggleLike(userId, postId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async follow(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw createHttpError(401, "Unauthorized");
      const { targetUserId } = req.params as { targetUserId: string };
      const result = await this._communityService.follow(userId, targetUserId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async unfollow(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw createHttpError(401, "Unauthorized");
      const { targetUserId } = req.params as { targetUserId: string };
      const result = await this._communityService.unfollow(userId, targetUserId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
  async getUserProfile(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const viewerId = req.user?.id;
      const { userId } = req.params as { userId: string };
      const data = await this._communityService.getUserProfile(userId, viewerId);
      if (!data) {
        res.status(HttpStatus.NOT_FOUND).json({ error: 'User not found' });
        return;
      }
      res.status(HttpStatus.OK).json(data);
    } catch (err) {
      next(err);
    }
  }
  
}


