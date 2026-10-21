"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
/**
 * Community DTO class for input validation
 * Handles validation and transformation of community-related requests
 */
class CommunityDTO {
    /**
     * Validates and transforms create post request
     */
    static validateCreatePostRequest(body) {
        const caption = body.caption ? validation_util_1.ValidationUtil.validateString(body.caption, 'caption', 500) : undefined;
        return {
            caption,
        };
    }
    /**
     * Validates and transforms get feed request
     */
    static validateGetFeedRequest(query) {
        const cursor = query.cursor ? validation_util_1.ValidationUtil.validateString(query.cursor, 'cursor', 50) : undefined;
        return {
            cursor,
        };
    }
    /**
     * Validates and transforms get user posts request
     */
    static validateGetUserPostsRequest(params, query) {
        const authorId = validation_util_1.ValidationUtil.validateString(params.authorId, 'authorId', 50);
        const cursor = query.cursor ? validation_util_1.ValidationUtil.validateString(query.cursor, 'cursor', 50) : undefined;
        return {
            authorId,
            cursor,
        };
    }
    /**
     * Validates and transforms search users request
     */
    static validateSearchUsersRequest(query) {
        const q = validation_util_1.ValidationUtil.validateString(query.q, 'q', 100);
        if (q.trim().length < 1) {
            throw new Error('Search query must be at least 2 characters long');
        }
        const cursor = query.cursor ? validation_util_1.ValidationUtil.validateString(query.cursor, 'cursor', 50) : undefined;
        return {
            q: q.trim(),
            cursor,
        };
    }
    /**
     * Validates and transforms add comment request
     */
    static validateAddCommentRequest(params, body) {
        const postId = validation_util_1.ValidationUtil.validateString(params.postId, 'postId', 50);
        const content = validation_util_1.ValidationUtil.validateString(body.content, 'content', 500);
        const parentCommentId = body.parentCommentId ? validation_util_1.ValidationUtil.validateString(body.parentCommentId, 'parentCommentId', 50) : undefined;
        if (content.trim().length === 0) {
            throw new Error('Comment content cannot be empty');
        }
        return {
            postId,
            content: content.trim(),
            parentCommentId,
        };
    }
    /**
     * Validates and transforms list comments request
     */
    static validateListCommentsRequest(params, query) {
        const postId = validation_util_1.ValidationUtil.validateString(params.postId, 'postId', 50);
        const cursor = query.cursor ? validation_util_1.ValidationUtil.validateString(query.cursor, 'cursor', 50) : undefined;
        return {
            postId,
            cursor,
        };
    }
    /**
     * Validates and transforms get post request
     */
    static validateGetPostRequest(params) {
        const postId = validation_util_1.ValidationUtil.validateString(params.postId, 'postId', 50);
        return {
            postId,
        };
    }
    /**
     * Validates and transforms toggle like request
     */
    static validateToggleLikeRequest(params) {
        const postId = validation_util_1.ValidationUtil.validateString(params.postId, 'postId', 50);
        return {
            postId,
        };
    }
    /**
     * Validates and transforms follow request
     */
    static validateFollowRequest(params) {
        const targetUserId = validation_util_1.ValidationUtil.validateString(params.targetUserId, 'targetUserId', 50);
        return {
            targetUserId,
        };
    }
    /**
     * Validates and transforms unfollow request
     */
    static validateUnfollowRequest(params) {
        const targetUserId = validation_util_1.ValidationUtil.validateString(params.targetUserId, 'targetUserId', 50);
        return {
            targetUserId,
        };
    }
    /**
     * Validates and transforms get user profile request
     */
    static validateGetUserProfileRequest(params) {
        const userId = validation_util_1.ValidationUtil.validateString(params.userId, 'userId', 50);
        return {
            userId,
        };
    }
}
exports.CommunityDTO = CommunityDTO;
//# sourceMappingURL=CommunityDTO.js.map