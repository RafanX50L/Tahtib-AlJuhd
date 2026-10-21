"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityController = void 0;
const utils_1 = require("../../utils");
const status_constant_1 = require("../../constants/status.constant");
const CommunityDTO_1 = require("../../dtos/reverse-mapping/shared/CommunityDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
class CommunityController {
    _communityService;
    constructor(_communityService) {
        this._communityService = _communityService;
    }
    async createPost(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            // Validate and transform request body using DTO
            const validatedBody = CommunityDTO_1.CommunityDTO.validateCreatePostRequest(req.body);
            const files = req.files || [];
            if (!files.length)
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, "No media uploaded");
            const post = await this._communityService.createPost(userId, validatedBody.caption, files);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, post, "Post created successfully", status_constant_1.HttpStatus.CREATED);
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    async getFeed(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw (0, utils_1.createHttpError)(401, "Unauthorized");
            // Validate and transform request query using DTO
            const validatedQuery = CommunityDTO_1.CommunityDTO.validateGetFeedRequest(req.query);
            const posts = await this._communityService.getFeed(userId, validatedQuery.cursor);
            // Check if there are more posts to load
            const hasMore = posts.length === 20;
            const nextCursor = posts.length > 0 ? posts[posts.length - 1].createdAt : undefined;
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { posts, hasMore, nextCursor }, "Feed retrieved successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    async getUserPosts(req, res, next) {
        try {
            // Validate and transform request parameters and query using DTO
            const validatedData = CommunityDTO_1.CommunityDTO.validateGetUserPostsRequest(req.params, req.query);
            const userId = req.user?.id;
            const posts = await this._communityService.getUserPosts(validatedData.authorId, validatedData.cursor, userId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { posts }, "User posts retrieved successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    async searchUsers(req, res, next) {
        try {
            // Validate and transform request query using DTO
            const validatedQuery = CommunityDTO_1.CommunityDTO.validateSearchUsersRequest(req.query);
            const currentUserId = req.user?.id;
            const users = await this._communityService.searchUsers(validatedQuery.q, currentUserId, validatedQuery.cursor);
            // Check if there are more users to load
            const hasMore = users.length === 20;
            const nextCursor = users.length > 0 ? users[users.length - 1]._id : undefined;
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { users, hasMore, nextCursor }, "Users search completed successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    async addComment(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw (0, utils_1.createHttpError)(401, "Unauthorized");
            // Validate and transform request parameters and body using DTO
            const validatedData = CommunityDTO_1.CommunityDTO.validateAddCommentRequest(req.params, req.body);
            const comment = await this._communityService.addComment(userId, validatedData.postId, validatedData.content, validatedData.parentCommentId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, comment, "Comment added successfully", 201);
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    async listComments(req, res, next) {
        try {
            // Validate and transform request parameters and query using DTO
            const validatedData = CommunityDTO_1.CommunityDTO.validateListCommentsRequest(req.params, req.query);
            const comments = await this._communityService.listComments(validatedData.postId, validatedData.cursor);
            // Check if there are more comments to load
            const hasMore = comments.length === 20;
            const nextCursor = comments.length > 0 ? comments[comments.length - 1].createdAt : undefined;
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { comments, hasMore, nextCursor }, "Comments retrieved successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    async getPost(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = CommunityDTO_1.CommunityDTO.validateGetPostRequest(req.params);
            const userId = req.user?.id;
            const post = await this._communityService.getPostById(validatedParams.postId, userId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, post, "Post retrieved successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    async toggleLike(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw (0, utils_1.createHttpError)(401, "Unauthorized");
            // Validate and transform request parameters using DTO
            const validatedParams = CommunityDTO_1.CommunityDTO.validateToggleLikeRequest(req.params);
            const result = await this._communityService.toggleLike(userId, validatedParams.postId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, result, "Like toggled successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    async follow(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw (0, utils_1.createHttpError)(401, "Unauthorized");
            // Validate and transform request parameters using DTO
            const validatedParams = CommunityDTO_1.CommunityDTO.validateFollowRequest(req.params);
            const result = await this._communityService.follow(userId, validatedParams.targetUserId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, result, "User followed successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    async unfollow(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw (0, utils_1.createHttpError)(401, "Unauthorized");
            // Validate and transform request parameters using DTO
            const validatedParams = CommunityDTO_1.CommunityDTO.validateUnfollowRequest(req.params);
            const result = await this._communityService.unfollow(userId, validatedParams.targetUserId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, result, "User unfollowed successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    async getUserProfile(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = CommunityDTO_1.CommunityDTO.validateGetUserProfileRequest(req.params);
            const viewerId = req.user?.id;
            const data = await this._communityService.getUserProfile(validatedParams.userId, viewerId);
            if (!data) {
                controller_error_handler_util_1.ControllerErrorHandler.handleNotFound(res, "User not found");
                return;
            }
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, data, "User profile retrieved successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
}
exports.CommunityController = CommunityController;
//# sourceMappingURL=community.controller.js.map