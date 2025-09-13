import { Types } from "mongoose";
import { uploadToS3, generateSignedUrl } from "@/utils/s3Storage.utils";
import { CommunityDTOMapper, MediaDTO, SearchUserDTO } from "@/dtos/shared/CommunityDTO";
import IUser from "@/core/interface/model/IUser.model";
import { IUserRepository } from "@/core/interface/repositories/IUser.repository";
import { ICommentRepository } from "@/core/interface/repositories/IComment.repository";
import { IPostRepository } from "@/core/interface/repositories/IPost.repository";
import { IFollowRepository } from "@/core/interface/repositories/IFollow.repository";
import { ILikeRepository } from "@/core/interface/repositories/ILike.repository";
import { ICommunityService } from "@/core/interface/services/shared/ICommunity.service";
import { IUserFileRepository } from "@/core/interface/repositories/IUserFile.repository";
import { IPost } from "@/models/Post.model";
import { createHttpError } from "@/utils";
import { HttpStatus } from "@/constants/status.constant";

export class CommunityService implements ICommunityService {
  constructor(
    private readonly postRepo: IPostRepository,
    private readonly commentRepo: ICommentRepository,
    private readonly likeRepo: ILikeRepository,
    private readonly followRepo: IFollowRepository,
    private readonly userRepo: IUserRepository,
    private readonly userFile: IUserFileRepository
  ) {}

  async createPost(
    authorId: string,
    caption: string | undefined,
    files: Express.Multer.File[]
  ) {
    const media = [] as Array<{
      key: string;
      type: "image" | "video";
      mimeType: string;
    }>;

    for (const file of files) {
      const key = await uploadToS3(file, "community-posts");
      const type = file.mimetype.startsWith("video/") ? "video" : "image";
      media.push({ key, type, mimeType: file.mimetype });
    }

    const post = await this.postRepo.create({
      authorId: new Types.ObjectId(authorId),
      caption,
      media,
    });

    return await this.mapPostWithSignedMedia(post, authorId);
  }

  async searchUsers(query: string, currentUserId?: string, cursor?: string): Promise<SearchUserDTO[]> {
    const regex = new RegExp(query, "i");
    const filter: Record<string, unknown> = { name: regex };
    
    if (cursor) {
      filter._id = { $lt: new Types.ObjectId(cursor) };
    }
    const users = await this.userRepo.searchForUsers(filter);
    return Promise.all(users.map((user) => this.mapUserToSearchUserDTO(user, currentUserId)));
  }

  async mapUserToSearchUserDTO(user: IUser, currentUserId?: string): Promise<SearchUserDTO> {
    const profilePhoto = await this.userFile.findLatestProfilePicture(user._id.toString());
    const profilePhotoUrl = profilePhoto?.filePath
      ? await generateSignedUrl(profilePhoto.filePath)
      : null;
    
    let isFollowing = false;
    if (currentUserId && currentUserId !== user._id.toString()) {
      const followRelation = await this.followRepo.findOne({ 
        followerId: new Types.ObjectId(currentUserId), 
        followingId: user._id 
      });
      isFollowing = !!followRelation;
    }
    
    return {
      _id: user._id.toString(),
      name: user.name,
      role: user.role,
      profilePhotoUrl: profilePhotoUrl,
      followersCount: await this.followRepo.countFollowers(user._id.toString()),
      postsCount: await this.postRepo.countPosts(user._id.toString()),
      isFollowing: isFollowing,
    };
  }

  async getFeed(userId: string, cursor?: string) {
    const userObjectId = new Types.ObjectId(userId);
    const following = await this.followRepo.getFollowingIds(userObjectId);
    const posts = await this.postRepo.getFeedForUser(
      userObjectId,
      following,
      20,
      cursor ? new Date(cursor) : undefined
    );
    return Promise.all(
      posts.map((p) => this.mapPostWithSignedMedia(p, userId))
    );
  }

  async getUserPosts(profileUserId: string, cursor?: string, currentUserId?: string) {
    const posts = await this.postRepo.findAll({
      authorId: new Types.ObjectId(profileUserId),
      ...(cursor ? { createdAt: { $lt: new Date(cursor) } } : {}),
    });
    const sorted = posts
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 20);
    return Promise.all(sorted.map((p) => this.mapPostWithSignedMedia(p, currentUserId)));
  }

  async addComment(
    userId: string,
    postId: string,
    content: string,
    parentCommentId?: string
  ) {
    const comment = await this.commentRepo.create({
      postId: new Types.ObjectId(postId),
      authorId: new Types.ObjectId(userId),
      content,
      parentCommentId: parentCommentId
        ? new Types.ObjectId(parentCommentId)
        : undefined,
    });
    await this.postRepo.update(postId, { $inc: { commentsCount: 1 } });
    const author = await this.userRepo.findById(new Types.ObjectId(userId));
    let profilePhotoUrl: string | null = null;
    if (author) {
      const profilePhoto = await this.userFile.findLatestProfilePicture(author._id.toString());
      profilePhotoUrl = profilePhoto?.filePath
        ? await generateSignedUrl(profilePhoto.filePath)
        : null;
    }
    const authorSummary = author
      ? CommunityDTOMapper.toUserSummaryDTO(author, profilePhotoUrl)
      : undefined;
    return CommunityDTOMapper.toCommentDTO(comment, authorSummary);
  }

  async listComments(postId: string, cursor?: string) {
    const comments = await this.commentRepo.findByPost(
      postId, 
      20, 
      cursor ? new Date(cursor) : undefined
    );
    return Promise.all(
      comments.map(async (c) => {
        const author = await this.userRepo.findById(c.authorId) as IUser;
        let profilePhotoUrl: string | null = null;
        if (author) {
          const profilePhoto = await this.userFile.findLatestProfilePicture(author._id.toString());
          profilePhotoUrl = profilePhoto?.filePath
            ? await generateSignedUrl(profilePhoto.filePath)
            : null;
        }
        console.log("author", profilePhotoUrl);
        const authorSummary = author
          ? CommunityDTOMapper.toUserSummaryDTO(author, profilePhotoUrl)
          : undefined;

        return CommunityDTOMapper.toCommentDTO(c, authorSummary);
      })
    );
  }

  async toggleLike(userId: string, postId: string) {
    const existing = await this.likeRepo.findOne({ userId, postId });
    if (existing) {
      await this.likeRepo.deleteOne({ _id: existing._id });
      await this.postRepo.update(postId, { $inc: { likesCount: -1 } });
      return { liked: false };
    }
    await this.likeRepo.create({
      userId: new Types.ObjectId(userId),
      postId: new Types.ObjectId(postId),
    });
    await this.postRepo.update(postId, { $inc: { likesCount: 1 } });
    return { liked: true };
  }

  async follow(userId: string, targetUserId: string) {
    if (userId === targetUserId) return { following: false };
    const existing = await this.followRepo.findOne({
      followerId: userId,
      followingId: targetUserId,
    });
    if (existing) return { following: true };
    await this.followRepo.create({
      followerId: new Types.ObjectId(userId),
      followingId: new Types.ObjectId(targetUserId),
    });
    return { following: true };
  }

  async unfollow(userId: string, targetUserId: string) {
    await this.followRepo.deleteOne({
      followerId: new Types.ObjectId(userId),
      followingId: new Types.ObjectId(targetUserId),
    });
    return { following: false };
  }

  async getPostById(postId: string, userId: string){
    const post = await this.postRepo.findById(new Types.ObjectId(postId));
    if (!post) throw createHttpError(HttpStatus.NOT_FOUND, "Post not found");
    const mapped = await this.mapPostWithSignedMedia(post, userId);
    return mapped;
  }

  private async mapPostWithSignedMedia(post: IPost, userId: string) {
    const media: MediaDTO[] = await Promise.all(
      (post.media || []).map(async (m: IPost['media'][0]) => ({
        url: await generateSignedUrl(m.key),
        type: m.type,
        mimeType: m.mimeType,
      }))
    );
    const author = await this.userRepo.findById(post.authorId);
    console.log(author._id);
    let profilePhotoUrl: string | null = null;
    if (author) {
      const profilePhoto = await this.userFile.findLatestProfilePicture(author._id.toString());
      profilePhotoUrl = profilePhoto?.filePath
        ? await generateSignedUrl(profilePhoto.filePath)
        : null;
    }
    const isLiked = (await this.likeRepo.findOne({
      userId: new Types.ObjectId(userId),
      postId: post._id,
    }))
      ? true
      : false;
    const authorSummary = author
      ? CommunityDTOMapper.toUserSummaryDTO(author, profilePhotoUrl)
      : undefined;
    return CommunityDTOMapper.toPostDTO(post, media, authorSummary, isLiked);
  }

  async getUserProfile(profileUserId: string, viewerUserId?: string) {
    const user = await this.userRepo.findById(new Types.ObjectId(profileUserId));
    if (!user) return null;

    const profilePhoto = await this.userFile.findLatestProfilePicture(profileUserId);
    const photoUrl = profilePhoto?.filePath
      ? await generateSignedUrl(profilePhoto.filePath)
      : null;

    console.log("files", profilePhoto);
    console.log("file url", photoUrl);
    const [followers, following] = await Promise.all([
      await this.followRepo.countFollowers(profileUserId),
      await this.followRepo.countFollowing(profileUserId),
    ]);

    let isFollowing = false;
    if (viewerUserId) {
      isFollowing = !!(await this.followRepo.findOne({
        followerId: viewerUserId,
        followingId: profileUserId,
      }));
    }

    return CommunityDTOMapper.toProfileDTO(
      user,
      followers,
      following,
      isFollowing,
      photoUrl
    );
  }
}
