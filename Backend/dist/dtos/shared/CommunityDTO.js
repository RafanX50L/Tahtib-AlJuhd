"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityDTOMapper = void 0;
class CommunityDTOMapper {
    static toPostDTO(doc, signedMedia, author, isLiked) {
        return {
            id: doc._id.toString(),
            authorId: doc.authorId.toString(),
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
    static toCommentDTO(doc, author) {
        return {
            id: doc._id.toString(),
            postId: doc.postId.toString(),
            authorId: doc.authorId.toString(),
            author: author,
            content: doc.content,
            parentCommentId: doc.parentCommentId ? doc.parentCommentId.toString() : null,
            createdAt: new Date(doc.createdAt).toISOString(),
        };
    }
    static toUserSummaryDTO(doc, profilePhotoUrl) {
        return {
            id: doc._id.toString(),
            name: doc.name,
            role: doc.role,
            profilePhotoUrl: profilePhotoUrl ?? undefined,
        };
    }
    static toProfileDTO(userDoc, followers, following, isFollowing, profilePhotoUrl) {
        return {
            user: this.toUserSummaryDTO(userDoc, profilePhotoUrl ?? undefined),
            followers,
            following,
            isFollowing,
        };
    }
}
exports.CommunityDTOMapper = CommunityDTOMapper;
//# sourceMappingURL=CommunityDTO.js.map