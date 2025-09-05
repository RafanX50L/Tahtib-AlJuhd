import { Types } from "mongoose";
import { PostRepository } from "@/Repository/Post.repository";
import { CommentRepository } from "@/Repository/Comment.repository";
import { LikeRepository } from "@/Repository/Like.repository";
import { FollowRepository } from "@/Repository/Follow.repository";
import { uploadToS3, generateSignedUrl } from "@/utils/s3Storage.utils";
import { UserRepository } from "@/Repository/user.Repository";
import { UserFileModel } from "@/models/UserFile.model";
import { FollowModel } from "@/models/Follow.model";
import { CommunityDTOMapper, MediaDTO } from "@/dtos/shared/CommunityDTO";

export class CommunityService {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly commentRepo: CommentRepository,
    private readonly likeRepo: LikeRepository,
    private readonly followRepo: FollowRepository,
    private readonly userRepo: UserRepository = new (require("@/Repository/user.Repository").UserRepository)()
  ) {}

  async createPost(
    authorId: string,
    caption: string | undefined,
    files: Express.Multer.File[]
  ) {
    const media = [] as Array<{ key: string; type: "image" | "video"; mimeType: string }>;

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

    return await this.mapPostWithSignedMedia(post);
  }

  async searchUsers(query: string) {
    const regex = new RegExp(query, "i");
    // Limit to essential public fields
    const users = await (this.userRepo as any).model
      .find({ name: regex }, { name: 1, role: 1 })
      .limit(10);
    return users;
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
    return Promise.all(posts.map((p) => this.mapPostWithSignedMedia(p)));
  }

  async getUserPosts(profileUserId: string, cursor?: string) {
    const posts = await this.postRepo.findAll({
      authorId: new Types.ObjectId(profileUserId),
      ...(cursor ? { createdAt: { $lt: new Date(cursor) } } : {}),
    } as any);
    const sorted = posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 20);
    return Promise.all(sorted.map((p) => this.mapPostWithSignedMedia(p)));
  }

  async addComment(userId: string, postId: string, content: string, parentCommentId?: string) {
    const comment = await this.commentRepo.create({
      postId: new Types.ObjectId(postId),
      authorId: new Types.ObjectId(userId),
      content,
      parentCommentId: parentCommentId ? new Types.ObjectId(parentCommentId) : undefined,
    } as any);
    return CommunityDTOMapper.toCommentDTO(comment);
  }

  async listComments(postId: string) {
    const comments = await this.commentRepo.findByPost(postId, 100);
    return comments.map((c) => CommunityDTOMapper.toCommentDTO(c));
  }

  async toggleLike(userId: string, postId: string) {
    const existing = await this.likeRepo.findOne({ userId, postId } as any);
    if (existing) {
      await this.likeRepo.deleteOne({ _id: existing._id } as any);
      return { liked: false };
    }
    await this.likeRepo.create({ userId: new Types.ObjectId(userId), postId: new Types.ObjectId(postId) } as any);
    return { liked: true };
  }

  async follow(userId: string, targetUserId: string) {
    if (userId === targetUserId) return { following: false };
    const existing = await this.followRepo.findOne({ followerId: userId, followingId: targetUserId } as any);
    if (existing) return { following: true };
    await this.followRepo.create({ followerId: new Types.ObjectId(userId), followingId: new Types.ObjectId(targetUserId) } as any);
    return { following: true };
  }

  async unfollow(userId: string, targetUserId: string) {
    await this.followRepo.deleteOne({ followerId: new Types.ObjectId(userId), followingId: new Types.ObjectId(targetUserId) } as any);
    return { following: false };
  }

  private async mapPostWithSignedMedia(post: any) {
    const media: MediaDTO[] = await Promise.all(
      (post.media || []).map(async (m: any) => ({
        url: await generateSignedUrl(m.key),
        type: m.type,
        mimeType: m.mimeType,
      }))
    );
    // attach author summary if available
    const author = await (this.userRepo as any).model.findById(post.authorId, { name: 1, role: 1 });
    let profilePhotoUrl: string | null = null;
    if (author) {
      const profilePhoto = await UserFileModel.findOne({ userId: author._id, purpose: 'profilePhoto' });
      profilePhotoUrl = profilePhoto?.filePath ? await generateSignedUrl(profilePhoto.filePath) : null;
    }
    const authorSummary = author ? CommunityDTOMapper.toUserSummaryDTO(author, profilePhotoUrl) : undefined;
    return CommunityDTOMapper.toPostDTO(post, media, authorSummary);
  }

  async getUserProfile(profileUserId: string, viewerUserId?: string) {
    const user = await (this.userRepo as any).model.findById(profileUserId, { name: 1, role: 1 });
    if (!user) return null;

    const profilePhoto = await UserFileModel.findOne({ userId: profileUserId, purpose: 'profilePhoto' });
    const photoUrl = profilePhoto?.filePath ? await generateSignedUrl(profilePhoto.filePath) : null;

    const [followers, following] = await Promise.all([
      FollowModel.countDocuments({ followingId: profileUserId }),
      FollowModel.countDocuments({ followerId: profileUserId }),
    ]);

    let isFollowing = false;
    if (viewerUserId) {
      isFollowing = !!(await FollowModel.findOne({ followerId: viewerUserId, followingId: profileUserId }));
    }

    return CommunityDTOMapper.toProfileDTO(user, followers, following, isFollowing, photoUrl);
  }
}


