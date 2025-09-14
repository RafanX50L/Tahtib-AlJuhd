import { ValidationUtil } from "@/utils/validation.util";

/**
 * Request DTOs for Community Controller
 * Input validation and transformation for community endpoints
 */

// Create Post Request DTO
export interface CreatePostRequestDTO {
  caption?: string;
}

// Get Feed Request DTO
export interface GetFeedRequestDTO {
  cursor?: string;
}

// Get User Posts Request DTO
export interface GetUserPostsRequestDTO {
  authorId: string;
  cursor?: string;
}

// Search Users Request DTO
export interface SearchUsersRequestDTO {
  q: string;
  cursor?: string;
}

// Add Comment Request DTO
export interface AddCommentRequestDTO {
  postId: string;
  content: string;
  parentCommentId?: string;
}

// List Comments Request DTO
export interface ListCommentsRequestDTO {
  postId: string;
  cursor?: string;
}

// Get Post Request DTO
export interface GetPostRequestDTO {
  postId: string;
}

// Toggle Like Request DTO
export interface ToggleLikeRequestDTO {
  postId: string;
}

// Follow Request DTO
export interface FollowRequestDTO {
  targetUserId: string;
}

// Unfollow Request DTO
export interface UnfollowRequestDTO {
  targetUserId: string;
}

// Get User Profile Request DTO
export interface GetUserProfileRequestDTO {
  userId: string;
}

/**
 * Community DTO class for input validation
 * Handles validation and transformation of community-related requests
 */
export class CommunityDTO {
  /**
   * Validates and transforms create post request
   */
  static validateCreatePostRequest(body: Record<string, unknown>): CreatePostRequestDTO {
    const caption = body.caption ? ValidationUtil.validateString(body.caption, 'caption', 500) : undefined;

    return {
      caption,
    };
  }

  /**
   * Validates and transforms get feed request
   */
  static validateGetFeedRequest(query: Record<string, unknown>): GetFeedRequestDTO {
    const cursor = query.cursor ? ValidationUtil.validateString(query.cursor, 'cursor', 50) : undefined;

    return {
      cursor,
    };
  }

  /**
   * Validates and transforms get user posts request
   */
  static validateGetUserPostsRequest(params: Record<string, unknown>, query: Record<string, unknown>): GetUserPostsRequestDTO {
    const authorId = ValidationUtil.validateString(params.authorId, 'authorId', 50);
    const cursor = query.cursor ? ValidationUtil.validateString(query.cursor, 'cursor', 50) : undefined;

    return {
      authorId,
      cursor,
    };
  }

  /**
   * Validates and transforms search users request
   */
  static validateSearchUsersRequest(query: Record<string, unknown>): SearchUsersRequestDTO {
    const q = ValidationUtil.validateString(query.q, 'q', 100);
    
    if (q.trim().length < 2) {
      throw new Error('Search query must be at least 2 characters long');
    }

    const cursor = query.cursor ? ValidationUtil.validateString(query.cursor, 'cursor', 50) : undefined;

    return {
      q: q.trim(),
      cursor,
    };
  }

  /**
   * Validates and transforms add comment request
   */
  static validateAddCommentRequest(params: Record<string, unknown>, body: Record<string, unknown>): AddCommentRequestDTO {
    const postId = ValidationUtil.validateString(params.postId, 'postId', 50);
    const content = ValidationUtil.validateString(body.content, 'content', 500);
    const parentCommentId = body.parentCommentId ? ValidationUtil.validateString(body.parentCommentId, 'parentCommentId', 50) : undefined;

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
  static validateListCommentsRequest(params: Record<string, unknown>, query: Record<string, unknown>): ListCommentsRequestDTO {
    const postId = ValidationUtil.validateString(params.postId, 'postId', 50);
    const cursor = query.cursor ? ValidationUtil.validateString(query.cursor, 'cursor', 50) : undefined;

    return {
      postId,
      cursor,
    };
  }

  /**
   * Validates and transforms get post request
   */
  static validateGetPostRequest(params: Record<string, unknown>): GetPostRequestDTO {
    const postId = ValidationUtil.validateString(params.postId, 'postId', 50);

    return {
      postId,
    };
  }

  /**
   * Validates and transforms toggle like request
   */
  static validateToggleLikeRequest(params: Record<string, unknown>): ToggleLikeRequestDTO {
    const postId = ValidationUtil.validateString(params.postId, 'postId', 50);

    return {
      postId,
    };
  }

  /**
   * Validates and transforms follow request
   */
  static validateFollowRequest(params: Record<string, unknown>): FollowRequestDTO {
    const targetUserId = ValidationUtil.validateString(params.targetUserId, 'targetUserId', 50);

    return {
      targetUserId,
    };
  }

  /**
   * Validates and transforms unfollow request
   */
  static validateUnfollowRequest(params: Record<string, unknown>): UnfollowRequestDTO {
    const targetUserId = ValidationUtil.validateString(params.targetUserId, 'targetUserId', 50);

    return {
      targetUserId,
    };
  }

  /**
   * Validates and transforms get user profile request
   */
  static validateGetUserProfileRequest(params: Record<string, unknown>): GetUserProfileRequestDTO {
    const userId = ValidationUtil.validateString(params.userId, 'userId', 50);

    return {
      userId,
    };
  }
}
