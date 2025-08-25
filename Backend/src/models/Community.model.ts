import { Schema, model } from 'mongoose';

export interface ICommunityPost {
  _id: Schema.Types.ObjectId;
  authorId: Schema.Types.ObjectId;
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
  likes: Schema.Types.ObjectId[];
  comments: Array<{
    _id: Schema.Types.ObjectId;
    authorId: Schema.Types.ObjectId;
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

const CommunityPostSchema = new Schema<ICommunityPost>({
  authorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  authorType: { 
    type: String, 
    enum: ['client', 'trainer'], 
    required: true 
  },
  contentType: { 
    type: String, 
    enum: ['progress', 'workout', 'motivation', 'question', 'achievement', 'general'],
    required: true 
  },
  title: { 
    type: String,
    maxlength: 200
  },
  content: { 
    type: String, 
    required: true,
    maxlength: 2000
  },
  media: [{
    type: { 
      type: String, 
      enum: ['image', 'video'], 
      required: true 
    },
    url: { 
      type: String, 
      required: true 
    },
    caption: { 
      type: String,
      maxlength: 200
    }
  }],
  tags: [{ 
    type: String,
    maxlength: 20
  }],
  likes: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  comments: [{
    authorId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    authorType: { 
      type: String, 
      enum: ['client', 'trainer'], 
      required: true 
    },
    content: { 
      type: String, 
      required: true,
      maxlength: 500
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    updatedAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  isPublic: { 
    type: Boolean, 
    default: true 
  },
  isApproved: { 
    type: Boolean, 
    default: true 
  },
  viewCount: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true 
});

// Indexes for better query performance
CommunityPostSchema.index({ authorId: 1, createdAt: -1 });
CommunityPostSchema.index({ contentType: 1, createdAt: -1 });
CommunityPostSchema.index({ tags: 1 });
CommunityPostSchema.index({ isPublic: 1, isApproved: 1, createdAt: -1 });
CommunityPostSchema.index({ likes: 1 });

export const CommunityPostModel = model<ICommunityPost>('CommunityPost', CommunityPostSchema);
