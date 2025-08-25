import { Document } from 'mongoose';

export interface ICommunityPost extends Document {
  authorId: string;
  authorType: 'client' | 'trainer';
  contentType: 'progress' | 'workout' | 'motivation' | 'question' | 'achievement' | 'general';
  title?: string;
  content: string;
  media?: Array<{
    type: 'image' | 'video';
    url: string;
    caption?: string;
  }>;
  tags: string[];
  likes: string[];
  comments: Array<{
    _id: string;
    authorId: string;
    authorType: 'client' | 'trainer';
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  isPublic: boolean;
  isApproved: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}
