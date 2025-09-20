import { Router } from "express";
import multer from "multer";
import { verifyAnyToken } from "@/middleware/verify.token.middleware";
import { CommunityService } from "@/Services/shared/community.service";
import { CommunityController } from "@/Controller/shared/community.controller";
import { PostRepository } from "@/Repository/Post.repository";
import { CommentRepository } from "@/Repository/Comment.repository";
import { LikeRepository } from "@/Repository/Like.repository";
import { FollowRepository } from "@/Repository/Follow.repository";
import { UserRepository } from "@/Repository/user.Repository";
import { UserFileRepository } from "@/Repository/UserFile.repository";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024, files: 10 } });

const service = new CommunityService(
  new PostRepository(),
  new CommentRepository(),
  new LikeRepository(),
  new FollowRepository(),
  new UserRepository(),
  new UserFileRepository(),
);
const controller = new CommunityController(service);

router.get("/feed", verifyAnyToken(), controller.getFeed.bind(controller));
router.get("/search", verifyAnyToken(), controller.searchUsers.bind(controller));
router.get("/user/:authorId/posts", verifyAnyToken(), controller.getUserPosts.bind(controller));
router.get("/user/:userId/profile", verifyAnyToken(), controller.getUserProfile.bind(controller));
router.post("/posts", verifyAnyToken(), upload.array("media", 10), controller.createPost.bind(controller));
router.get("/posts/:postId/comments", verifyAnyToken(), controller.listComments.bind(controller));
router.get("/posts/:postId", verifyAnyToken(), controller.getPost.bind(controller));
router.post("/posts/:postId/comments", verifyAnyToken(), controller.addComment.bind(controller));
router.post("/posts/:postId/like", verifyAnyToken(), controller.toggleLike.bind(controller));
router.post("/follow/:targetUserId", verifyAnyToken(), controller.follow.bind(controller));
router.delete("/follow/:targetUserId", verifyAnyToken(), controller.unfollow.bind(controller));

export default router;


