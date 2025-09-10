"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityService = void 0;
const mongoose_1 = require("mongoose");
const s3Storage_utils_1 = require("../../utils/s3Storage.utils");
const CommunityDTO_1 = require("../../dtos/shared/CommunityDTO");
class CommunityService {
    postRepo;
    commentRepo;
    likeRepo;
    followRepo;
    userRepo;
    userFile;
    constructor(postRepo, commentRepo, likeRepo, followRepo, userRepo, userFile) {
        this.postRepo = postRepo;
        this.commentRepo = commentRepo;
        this.likeRepo = likeRepo;
        this.followRepo = followRepo;
        this.userRepo = userRepo;
        this.userFile = userFile;
    }
    async createPost(authorId, caption, files) {
        const media = [];
        for (const file of files) {
            const key = await (0, s3Storage_utils_1.uploadToS3)(file, "community-posts");
            const type = file.mimetype.startsWith("video/") ? "video" : "image";
            media.push({ key, type, mimeType: file.mimetype });
        }
        const post = await this.postRepo.create({
            authorId: new mongoose_1.Types.ObjectId(authorId),
            caption,
            media,
        });
        return await this.mapPostWithSignedMedia(post, authorId);
    }
    async searchUsers(query, currentUserId, cursor) {
        const regex = new RegExp(query, "i");
        const filter = { name: regex };
        if (cursor) {
            filter._id = { $lt: new mongoose_1.Types.ObjectId(cursor) };
        }
        const users = await this.userRepo.searchForUsers(filter);
        return Promise.all(users.map((user) => this.mapUserToSearchUserDTO(user, currentUserId)));
    }
    async mapUserToSearchUserDTO(user, currentUserId) {
        const profilePhoto = await this.userFile.findLatestProfilePicture(user._id.toString());
        const profilePhotoUrl = profilePhoto?.filePath
            ? await (0, s3Storage_utils_1.generateSignedUrl)(profilePhoto.filePath)
            : null;
        let isFollowing = false;
        if (currentUserId && currentUserId !== user._id.toString()) {
            const followRelation = await this.followRepo.findOne({
                followerId: new mongoose_1.Types.ObjectId(currentUserId),
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
    async getFeed(userId, cursor) {
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        const following = await this.followRepo.getFollowingIds(userObjectId);
        const posts = await this.postRepo.getFeedForUser(userObjectId, following, 20, cursor ? new Date(cursor) : undefined);
        return Promise.all(posts.map((p) => this.mapPostWithSignedMedia(p, userId)));
    }
    async getUserPosts(profileUserId, cursor) {
        const posts = await this.postRepo.findAll({
            authorId: new mongoose_1.Types.ObjectId(profileUserId),
            ...(cursor ? { createdAt: { $lt: new Date(cursor) } } : {}),
        });
        const sorted = posts
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 20);
        return Promise.all(sorted.map((p) => this.mapPostWithSignedMedia(p)));
    }
    async addComment(userId, postId, content, parentCommentId) {
        const comment = await this.commentRepo.create({
            postId: new mongoose_1.Types.ObjectId(postId),
            authorId: new mongoose_1.Types.ObjectId(userId),
            content,
            parentCommentId: parentCommentId
                ? new mongoose_1.Types.ObjectId(parentCommentId)
                : undefined,
        });
        await this.postRepo.update(postId, { $inc: { commentsCount: 1 } });
        const author = await this.userRepo.findById(new mongoose_1.Types.ObjectId(userId));
        let profilePhotoUrl = null;
        if (author) {
            const profilePhoto = await this.userFile.findLatestProfilePicture(author._id.toString());
            profilePhotoUrl = profilePhoto?.filePath
                ? await (0, s3Storage_utils_1.generateSignedUrl)(profilePhoto.filePath)
                : null;
        }
        const authorSummary = author
            ? CommunityDTO_1.CommunityDTOMapper.toUserSummaryDTO(author, profilePhotoUrl)
            : undefined;
        return CommunityDTO_1.CommunityDTOMapper.toCommentDTO(comment, authorSummary);
    }
    async listComments(postId, cursor) {
        const comments = await this.commentRepo.findByPost(postId, 20, cursor ? new Date(cursor) : undefined);
        return Promise.all(comments.map(async (c) => {
            const author = await this.userRepo.findById(c.authorId);
            let profilePhotoUrl = null;
            if (author) {
                const profilePhoto = await this.userFile.findLatestProfilePicture(author._id.toString());
                profilePhotoUrl = profilePhoto?.filePath
                    ? await (0, s3Storage_utils_1.generateSignedUrl)(profilePhoto.filePath)
                    : null;
            }
            console.log("author", profilePhotoUrl);
            const authorSummary = author
                ? CommunityDTO_1.CommunityDTOMapper.toUserSummaryDTO(author, profilePhotoUrl)
                : undefined;
            return CommunityDTO_1.CommunityDTOMapper.toCommentDTO(c, authorSummary);
        }));
    }
    async toggleLike(userId, postId) {
        const existing = await this.likeRepo.findOne({ userId, postId });
        if (existing) {
            await this.likeRepo.deleteOne({ _id: existing._id });
            await this.postRepo.update(postId, { $inc: { likesCount: -1 } });
            return { liked: false };
        }
        await this.likeRepo.create({
            userId: new mongoose_1.Types.ObjectId(userId),
            postId: new mongoose_1.Types.ObjectId(postId),
        });
        await this.postRepo.update(postId, { $inc: { likesCount: 1 } });
        return { liked: true };
    }
    async follow(userId, targetUserId) {
        if (userId === targetUserId)
            return { following: false };
        const existing = await this.followRepo.findOne({
            followerId: userId,
            followingId: targetUserId,
        });
        if (existing)
            return { following: true };
        await this.followRepo.create({
            followerId: new mongoose_1.Types.ObjectId(userId),
            followingId: new mongoose_1.Types.ObjectId(targetUserId),
        });
        return { following: true };
    }
    async unfollow(userId, targetUserId) {
        await this.followRepo.deleteOne({
            followerId: new mongoose_1.Types.ObjectId(userId),
            followingId: new mongoose_1.Types.ObjectId(targetUserId),
        });
        return { following: false };
    }
    async mapPostWithSignedMedia(post, userId) {
        const media = await Promise.all((post.media || []).map(async (m) => ({
            url: await (0, s3Storage_utils_1.generateSignedUrl)(m.key),
            type: m.type,
            mimeType: m.mimeType,
        })));
        const author = await this.userRepo.findById(post.authorId);
        console.log(author._id);
        let profilePhotoUrl = null;
        if (author) {
            const profilePhoto = await this.userFile.findLatestProfilePicture(author._id.toString());
            profilePhotoUrl = profilePhoto?.filePath
                ? await (0, s3Storage_utils_1.generateSignedUrl)(profilePhoto.filePath)
                : null;
        }
        const isLiked = (await this.likeRepo.findOne({
            userId: new mongoose_1.Types.ObjectId(userId),
            postId: post._id,
        }))
            ? true
            : false;
        const authorSummary = author
            ? CommunityDTO_1.CommunityDTOMapper.toUserSummaryDTO(author, profilePhotoUrl)
            : undefined;
        return CommunityDTO_1.CommunityDTOMapper.toPostDTO(post, media, authorSummary, isLiked);
    }
    async getUserProfile(profileUserId, viewerUserId) {
        const user = await this.userRepo.findById(new mongoose_1.Types.ObjectId(profileUserId));
        if (!user)
            return null;
        const profilePhoto = await this.userFile.findLatestProfilePicture(profileUserId);
        const photoUrl = profilePhoto?.filePath
            ? await (0, s3Storage_utils_1.generateSignedUrl)(profilePhoto.filePath)
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
        return CommunityDTO_1.CommunityDTOMapper.toProfileDTO(user, followers, following, isFollowing, photoUrl);
    }
}
exports.CommunityService = CommunityService;
//# sourceMappingURL=Community.service.js.map