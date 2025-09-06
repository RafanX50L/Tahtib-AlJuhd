export type MediaDTO = {
  url: string;
  type: "image" | "video";
  mimeType: string;
};

export type PostDTO = {
  id: string;
  authorId: string;
  author?: UserSummaryDTO;
  caption?: string;
  media: MediaDTO[];
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  isLiked?: boolean;
  createdAt: string;
};

export type CommentDTO = {
  id: string;
  postId: string;
  authorId: string;
  author?: UserSummaryDTO;
  content: string;
  parentCommentId?: string | null;
  createdAt: string;
};

export type UserSummaryDTO = {
  id: string;
  name: string;
  role: "client" | "trainer" | "admin";
  profilePhotoUrl?: string | null;
};

export type ProfileDTO = {
  user: UserSummaryDTO;
  followers: number;
  following: number;
  isFollowing: boolean;
};

export type SearchUserDTO = {
  _id: string;
  name: string;
  role: "client" | "trainer" | "admin";
  profilePhotoUrl?: string | null;
  followersCount: number;
  postsCount: number;
  isFollowing: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  hasMore: boolean;
  nextCursor?: string;
  total?: number;
};


