import { NextFunction, Response } from "express";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { CommunityService } from "@/Services/common/Community.service";
import { createHttpError } from "@/utils";

export class CommunityController {
  constructor(private readonly service: CommunityService) {}

  async createPost(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw createHttpError(401, "Unauthorized");
      const files = (req.files as Express.Multer.File[]) || [];
      if (!files.length) throw createHttpError(400, "No media uploaded");
      const { caption } = req.body as { caption?: string };
      const post = await this.service.createPost(userId, caption, files);
      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  }

  async getFeed(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw createHttpError(401, "Unauthorized");
      const { cursor } = req.query as { cursor?: string };
      const posts = await this.service.getFeed(userId, cursor);
      res.json({ posts });
    } catch (err) {
      next(err);
    }
  }

  async getUserPosts(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params as { userId: string };
      const { cursor } = req.query as { cursor?: string };
      const posts = await this.service.getUserPosts(userId, cursor);
      res.json({ posts });
    } catch (err) {
      next(err);
    }
  }

  async searchUsers(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const { q } = req.query as { q?: string };
      if (!q || q.trim().length < 2) return res.json({ users: [] });
      const users = await this.service.searchUsers(q.trim());
      res.json({ users });
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
      const comment = await this.service.addComment(userId, postId, content, parentCommentId);
      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  }

  async listComments(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params as { postId: string };
      const comments = await this.service.listComments(postId);
      res.json({ comments });
    } catch (err) {
      next(err);
    }
  }

  async getPost(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params as { postId: string };
      // reuse get by id via repo to map one
      const { service } = this as any;
      const post = await (this as any).service.postRepo.findById(postId);
      if (!post) return res.status(404).json({ error: 'Post not found' });
      const mapped = await (this as any).service["mapPostWithSignedMedia"].call(this.service, post);
      res.json(mapped);
    } catch (err) {
      next(err);
    }
  }

  async toggleLike(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw createHttpError(401, "Unauthorized");
      const { postId } = req.params as { postId: string };
      const result = await this.service.toggleLike(userId, postId);
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
      const result = await this.service.follow(userId, targetUserId);
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
      const result = await this.service.unfollow(userId, targetUserId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getUserProfile(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const viewerId = req.user?.id;
      const { userId } = req.params as { userId: string };
      const data = await this.service.getUserProfile(userId, viewerId);
      if (!data) return res.status(404).json({ error: 'User not found' });
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
}


