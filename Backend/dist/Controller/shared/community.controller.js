"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityController = void 0;
const utils_1 = require("../../utils");
const status_constant_1 = require("../../constants/status.constant");
class CommunityController {
    service;
    constructor(service) {
        this.service = service;
    }
    async createPost(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw (0, utils_1.createHttpError)(401, "Unauthorized");
            const files = req.files || [];
            if (!files.length)
                throw (0, utils_1.createHttpError)(400, "No media uploaded");
            const { caption } = req.body;
            const post = await this.service.createPost(userId, caption, files);
            res.status(status_constant_1.HttpStatus.CREATED).json(post);
        }
        catch (err) {
            next(err);
        }
    }
    async getFeed(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw (0, utils_1.createHttpError)(401, "Unauthorized");
            const { cursor } = req.query;
            const posts = await this.service.getFeed(userId, cursor);
            // Check if there are more posts to load
            const hasMore = posts.length === 20;
            const nextCursor = posts.length > 0 ? posts[posts.length - 1].createdAt : undefined;
            res.status(status_constant_1.HttpStatus.OK).json({ posts, hasMore, nextCursor });
        }
        catch (err) {
            next(err);
        }
    }
    async getUserPosts(req, res, next) {
        try {
            const { userId } = req.params;
            const { cursor } = req.query;
            const posts = await this.service.getUserPosts(userId, cursor);
            res.json({ posts });
        }
        catch (err) {
            next(err);
        }
    }
    async searchUsers(req, res, next) {
        try {
            const { q, cursor } = req.query;
            if (!q || q.trim().length < 2) {
                res.status(status_constant_1.HttpStatus.BAD_REQUEST).json({ users: [], hasMore: false, nextCursor: undefined });
                return;
            }
            const currentUserId = req.user?.id;
            const users = await this.service.searchUsers(q.trim(), currentUserId, cursor);
            // Check if there are more users to load
            const hasMore = users.length === 20;
            const nextCursor = users.length > 0 ? users[users.length - 1]._id : undefined;
            res.status(status_constant_1.HttpStatus.OK).json({ users, hasMore, nextCursor });
        }
        catch (err) {
            next(err);
        }
    }
    async addComment(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw (0, utils_1.createHttpError)(401, "Unauthorized");
            const { postId } = req.params;
            const { content, parentCommentId } = req.body;
            const comment = await this.service.addComment(userId, postId, content, parentCommentId);
            res.status(201).json(comment);
        }
        catch (err) {
            next(err);
        }
    }
    async listComments(req, res, next) {
        try {
            const { postId } = req.params;
            const { cursor } = req.query;
            const comments = await this.service.listComments(postId, cursor);
            // Check if there are more comments to load
            const hasMore = comments.length === 20;
            const nextCursor = comments.length > 0 ? comments[comments.length - 1].createdAt : undefined;
            res.json({ comments, hasMore, nextCursor });
        }
        catch (err) {
            next(err);
        }
    }
    async getPost(req, res, next) {
        try {
            const { postId } = req.params;
            // reuse get by id via repo to map one
            const { service } = this;
            const post = await this.service.postRepo.findById(postId);
            if (!post) {
                res.status(status_constant_1.HttpStatus.NOT_FOUND).json({ error: 'Post not found' });
                return;
            }
            const mapped = await this.service["mapPostWithSignedMedia"].call(this.service, post);
            res.json(mapped);
        }
        catch (err) {
            next(err);
        }
    }
    async toggleLike(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw (0, utils_1.createHttpError)(401, "Unauthorized");
            const { postId } = req.params;
            const result = await this.service.toggleLike(userId, postId);
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    }
    async follow(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw (0, utils_1.createHttpError)(401, "Unauthorized");
            const { targetUserId } = req.params;
            const result = await this.service.follow(userId, targetUserId);
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    }
    async unfollow(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw (0, utils_1.createHttpError)(401, "Unauthorized");
            const { targetUserId } = req.params;
            const result = await this.service.unfollow(userId, targetUserId);
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    }
    async getUserProfile(req, res, next) {
        try {
            const viewerId = req.user?.id;
            const { userId } = req.params;
            const data = await this.service.getUserProfile(userId, viewerId);
            if (!data) {
                res.status(status_constant_1.HttpStatus.NOT_FOUND).json({ error: 'User not found' });
                return;
            }
            res.status(status_constant_1.HttpStatus.OK).json(data);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.CommunityController = CommunityController;
//# sourceMappingURL=community.controller.js.map