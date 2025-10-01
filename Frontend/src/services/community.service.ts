import api from "@/services/implementation/api";
import { CommentDTO, PostDTO, SearchUserDTO } from "@/types/community";
import { COMMUNITY_ROUTES } from "@/utils/constant";
// import { AxiosError } from "axios";
import { toast } from "sonner";

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

// Base path is handled by axios instance (HOST/api); community routes live under /community

export const CommunityService = {
  fetchFeed: async (cursor?: string):Promise<{data:{posts:PostDTO[], hasMore: boolean, nextCursor?: string}, error:string | null}> => {
    try {
      const res = await api.get(COMMUNITY_ROUTES.FEED, { params: { cursor } });
      console.log(res);
      toast.success("Feed fetched successfully");
      return { data: res.data.data, error: null };
    } catch (error: unknown) {
      const err = error as ApiError;
      const errorMessage =
        err.response?.data?.error || "Failed to fetch feed. Please try again.";
      console.log("Error fetching feed:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  fetchComments: async (postId: string, cursor?: string):Promise<{data:{comments:CommentDTO[], hasMore: boolean, nextCursor?: string},error:string|null}> => {
    try {
      const res = await api.get(COMMUNITY_ROUTES.POST_COMMENTS(postId), {
        params: { cursor },
      });
      toast.success("Comments fetched successfully");
      return { data: res.data.data, error: null };
    } catch (error: unknown) {
      const err = error as ApiError;
      const errorMessage =
        err.response?.data?.error || "Failed to fetch comments. Please try again.";
      console.log("Error fetching comments:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  fetchUserPosts: async (userId: string, cursor?: string):Promise<{data:{posts:PostDTO[]}, error:string | null}> => {
    try {
      const res = await api.get(COMMUNITY_ROUTES.USER_POSTS(userId), {
        params: { cursor },
      });
      toast.success("User posts fetched successfully");
      return { data: res.data.data, error: null };
    } catch (error: unknown) {
      const err = error as ApiError;
      const errorMessage =
        err.response?.data?.error || "Failed to fetch user posts. Please try again.";
      console.log("Error fetching user posts:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  fetchUserProfile: async (userId: string) => {
    try {
      const res = await api.get(COMMUNITY_ROUTES.USER_PROFILE(userId));
      toast.success("User profile fetched successfully");
      return { data: res.data.data, error: null };
    } catch (error: unknown) {
      const err = error as ApiError;
      const errorMessage =
        err.response?.data?.error || "Failed to fetch user profile. Please try again.";
      console.log("Error fetching user profile:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  fetchPost: async (postId: string) => {
    try {
      const res = await api.get(COMMUNITY_ROUTES.POST(postId));
      toast.success("Post fetched successfully");
      return { data: res.data.data, error: null };
    } catch (error: unknown) {
      const err = error as ApiError;
      const errorMessage =
        err.response?.data?.error || "Failed to fetch post. Please try again.";
      console.log("Error fetching post:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  createPost: async (form: FormData) => {
    try {
      const res = await api.post(COMMUNITY_ROUTES.POST, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post created successfully");
      return { data: res.data.data, error: null };
    } catch (error: unknown) {
      const err = error as ApiError;
      const errorMessage =
        err.response?.data?.error || "Failed to create post. Please try again.";
      console.log("Error creating post:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  toggleLike: async (postId: string) => {
    try {
      const res = await api.post(COMMUNITY_ROUTES.TOGGLE_LIKE(postId));
      toast.success("Like toggled successfully");
      return { data: res.data.data, error: null };
    } catch (error: unknown) {
      const err = error as ApiError;
      const errorMessage =
        err.response?.data?.error || "Failed to toggle like. Please try again.";
      console.log("Error toggling like:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  addComment: async (
    postId: string,
    content: string,
    parentCommentId?: string
  ) => {
    try {
      const res = await api.post(COMMUNITY_ROUTES.POST_COMMENTS(postId), {
        content,
        parentCommentId,
      });
      toast.success("Comment added successfully");
      return { data: res.data.data, error: null };
    } catch (error: unknown) {
      const err = error as ApiError;
      const errorMessage =
        err.response?.data?.error || "Failed to add comment. Please try again.";
      console.log("Error adding comment:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  follow: async (targetUserId: string) => {
    try {
      const res = await api.post(COMMUNITY_ROUTES.FOLLOW(targetUserId));
      toast.success("User followed successfully");
      return { data: res.data.data, error: null };
    } catch (error: unknown) {
      const err = error as ApiError;
      const errorMessage =
        err.response?.data?.error || "Failed to follow user. Please try again.";
      console.log("Error following user:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  unfollow: async (targetUserId: string) => {
    try {
      const res = await api.delete(COMMUNITY_ROUTES.UNFOLLOW(targetUserId));
      toast.success("User unfollowed successfully");
      return { data: res.data.data, error: null };
    } catch (error: unknown) {
      const err = error as ApiError;
      const errorMessage =
        err.response?.data?.error || "Failed to unfollow user. Please try again.";
      console.log("Error unfollowing user:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  searchUsers: async (q: string, cursor?: string):Promise<{data:{users:SearchUserDTO[], hasMore: boolean, nextCursor?: string}, error:string | null}> => {
    try {
      const res = await api.get(COMMUNITY_ROUTES.SEARCH, { params: { q, cursor } });
      toast.success("Users searched successfully");
      return { data: res.data.data, error: null };
    } catch (error: unknown) {
      const err = error as ApiError;
      const errorMessage =
        err.response?.data?.error || "Failed to search users. Please try again.";
      console.log("Error searching users:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },
};