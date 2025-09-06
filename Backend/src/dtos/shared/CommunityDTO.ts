import { Types } from "mongoose";

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
  author: UserSummaryDTO;
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

export class CommunityDTOMapper {
  static  toPostDTO(doc: any, signedMedia: MediaDTO[], author?: UserSummaryDTO, isLiked?: boolean): PostDTO {
    return {
      id: (doc._id as Types.ObjectId).toString(),
      authorId: (doc.authorId as Types.ObjectId).toString(),
      author,
      caption: doc.caption || undefined,
      media: signedMedia,
      stats: {
        likes: Number(doc.likesCount || 0),
        comments: Number(doc.commentsCount || 0),
        shares: Number(doc.sharesCount || 0),
      },
      isLiked,
      createdAt: new Date(doc.createdAt).toISOString(),
    };
  }

  static toCommentDTO(doc: any, author?: UserSummaryDTO): CommentDTO {
    return {
      id: (doc._id as Types.ObjectId).toString(),
      postId: (doc.postId as Types.ObjectId).toString(),
      authorId: (doc.authorId as Types.ObjectId).toString(),
      author: author,
      content: doc.content,
      parentCommentId: doc.parentCommentId ? (doc.parentCommentId as Types.ObjectId).toString() : null,
      createdAt: new Date(doc.createdAt).toISOString(),
    };
  }

  static toUserSummaryDTO(doc: any, profilePhotoUrl?: string | null): UserSummaryDTO {
    return {
      id: (doc._id as Types.ObjectId).toString(),
      name: doc.name,
      role: doc.role,
      profilePhotoUrl: profilePhotoUrl ?? undefined,
    };
  }

  static toProfileDTO(userDoc: any, followers: number, following: number, isFollowing: boolean, profilePhotoUrl?: string | null): ProfileDTO {
    return {
      user: this.toUserSummaryDTO(userDoc, profilePhotoUrl ?? undefined),
      followers,
      following,
      isFollowing,
    };
  }
}


