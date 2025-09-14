import { NextFunction, Response } from "express";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { createHttpError } from "@/utils";
import { ICommunityService } from "@/core/interface/services/shared/ICommunity.service";
import { ICommunityController } from "@/core/interface/controllers/shared/ICommunity.Controller";
import { HttpStatus } from "@/constants/status.constant";
import { 
  CommunityDTO,
  CreatePostRequestDTO,
  GetFeedRequestDTO,
  GetUserPostsRequestDTO,
  SearchUsersRequestDTO,
  AddCommentRequestDTO,
  ListCommentsRequestDTO,
  GetPostRequestDTO,
  ToggleLikeRequestDTO,
  FollowRequestDTO,
  UnfollowRequestDTO,
  GetUserProfileRequestDTO
} from '@/dtos/reverse-mapping/shared/CommunityDTO';
import { ControllerErrorHandler } from '@/utils/controller-error-handler.util';

export class CommunityController implements ICommunityController {
  constructor(private readonly _communityService: ICommunityService) {}

  async createPost(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw createHttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
      
      // Validate and transform request body using DTO
      const validatedBody: CreatePostRequestDTO = CommunityDTO.validateCreatePostRequest(req.body);
      
      const files = (req.files as Express.Multer.File[]) || [];
      if (!files.length) throw createHttpError(HttpStatus.BAD_REQUEST, "No media uploaded");
      
      const post = await this._communityService.createPost(userId, validatedBody.caption, files);
      
      ControllerErrorHandler.handleSuccess(res, post, "Post created successfully", HttpStatus.CREATED);
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  }

  async getFeed(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw createHttpError(401, "Unauthorized");
      
      // Validate and transform request query using DTO
      const validatedQuery: GetFeedRequestDTO = CommunityDTO.validateGetFeedRequest(req.query);
      
      const posts = await this._communityService.getFeed(userId, validatedQuery.cursor);
      
      // Check if there are more posts to load
      const hasMore = posts.length === 20;
      const nextCursor = posts.length > 0 ? posts[posts.length - 1].createdAt : undefined;
      
      ControllerErrorHandler.handleSuccess(res, { posts, hasMore, nextCursor }, "Feed retrieved successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  }

  async getUserPosts(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      // Validate and transform request parameters and query using DTO
      const validatedData: GetUserPostsRequestDTO = CommunityDTO.validateGetUserPostsRequest(req.params, req.query);
      
      const userId = req.user?.id;
      const posts = await this._communityService.getUserPosts(validatedData.authorId, validatedData.cursor, userId);
      
      ControllerErrorHandler.handleSuccess(res, { posts }, "User posts retrieved successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  }

  async searchUsers(req: AddedRequest, res: Response, next: NextFunction):Promise<void> {
    try {
      // Validate and transform request query using DTO
      const validatedQuery: SearchUsersRequestDTO = CommunityDTO.validateSearchUsersRequest(req.query);
      
      const currentUserId = req.user?.id;
      const users = await this._communityService.searchUsers(validatedQuery.q, currentUserId, validatedQuery.cursor);
      
      // Check if there are more users to load
      const hasMore = users.length === 20;
      const nextCursor = users.length > 0 ? users[users.length - 1]._id : undefined;
      
      ControllerErrorHandler.handleSuccess(res, { users, hasMore, nextCursor }, "Users search completed successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  }

  async addComment(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw createHttpError(401, "Unauthorized");
      
      // Validate and transform request parameters and body using DTO
      const validatedData: AddCommentRequestDTO = CommunityDTO.validateAddCommentRequest(req.params, req.body);
      
      const comment = await this._communityService.addComment(userId, validatedData.postId, validatedData.content, validatedData.parentCommentId);
      
      ControllerErrorHandler.handleSuccess(res, comment, "Comment added successfully", 201);
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  }

  async listComments(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      // Validate and transform request parameters and query using DTO
      const validatedData: ListCommentsRequestDTO = CommunityDTO.validateListCommentsRequest(req.params, req.query);
      
      const comments = await this._communityService.listComments(validatedData.postId, validatedData.cursor);
      
      // Check if there are more comments to load
      const hasMore = comments.length === 20;
      const nextCursor = comments.length > 0 ? comments[comments.length - 1].createdAt : undefined;
      
      ControllerErrorHandler.handleSuccess(res, { comments, hasMore, nextCursor }, "Comments retrieved successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  }

  async getPost(req: AddedRequest, res: Response, next: NextFunction):Promise<void> {
    try {
      // Validate and transform request parameters using DTO
      const validatedParams: GetPostRequestDTO = CommunityDTO.validateGetPostRequest(req.params);
      
      const userId = req.user?.id;
      const post = await this._communityService.getPostById(validatedParams.postId, userId);
      
      ControllerErrorHandler.handleSuccess(res, post, "Post retrieved successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  }

  async toggleLike(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw createHttpError(401, "Unauthorized");
      
      // Validate and transform request parameters using DTO
      const validatedParams: ToggleLikeRequestDTO = CommunityDTO.validateToggleLikeRequest(req.params);
      
      const result = await this._communityService.toggleLike(userId, validatedParams.postId);
      
      ControllerErrorHandler.handleSuccess(res, result, "Like toggled successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  }

  async follow(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw createHttpError(401, "Unauthorized");
      
      // Validate and transform request parameters using DTO
      const validatedParams: FollowRequestDTO = CommunityDTO.validateFollowRequest(req.params);
      
      const result = await this._communityService.follow(userId, validatedParams.targetUserId);
      
      ControllerErrorHandler.handleSuccess(res, result, "User followed successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  }

  async unfollow(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw createHttpError(401, "Unauthorized");
      
      // Validate and transform request parameters using DTO
      const validatedParams: UnfollowRequestDTO = CommunityDTO.validateUnfollowRequest(req.params);
      
      const result = await this._communityService.unfollow(userId, validatedParams.targetUserId);
      
      ControllerErrorHandler.handleSuccess(res, result, "User unfollowed successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  }
  
  async getUserProfile(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate and transform request parameters using DTO
      const validatedParams: GetUserProfileRequestDTO = CommunityDTO.validateGetUserProfileRequest(req.params);
      
      const viewerId = req.user?.id;
      const data = await this._communityService.getUserProfile(validatedParams.userId, viewerId);
      
      if (!data) {
        ControllerErrorHandler.handleNotFound(res, "User not found");
        return;
      }
      
      ControllerErrorHandler.handleSuccess(res, data, "User profile retrieved successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  }
  
}


