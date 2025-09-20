import { useState, useEffect, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CommentDTO, PostDTO } from "@/types/community";
import {
  AvatarCstm,
  ButtonCstm,
  DialogContentCstm,
  DialogCstm,
  InputCstm,
} from "@/pages/common/community/CommunityApp";
import { CommunityService } from "@/services/community.service";
import { useVideoManager } from "@/hooks/useVideoManager";

// Comment Modal Component
interface CommentModalProps {
  post: PostDTO | null;
  posts: PostDTO[];
  isOpen: boolean;
  onClose: () => void;
  onLikeToggle: (postId: string) => void;
  onNavigateToPost?: (postId: string) => void;
  initialMediaIndex?: number;
}

const CommentModal: React.FC<CommentModalProps> = ({
  post,
  posts,
  isOpen,
  onClose,
  onLikeToggle,
  onNavigateToPost,
  initialMediaIndex = 0,
}) => {
  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>();
  const [currentPost, setCurrentPost] = useState<PostDTO | null>(post);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const { videoRef, handlePlay, handlePause } = useVideoManager();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowLeft":
          if (currentMediaIndex > 0) {
            navigateToPreviousMedia();
          } else if (currentIndex > 0) {
            navigateToPreviousPost();
          }
          break;
        case "ArrowRight":
          if (currentPost && currentMediaIndex < currentPost.media.length - 1) {
            navigateToNextMedia();
          } else if (currentIndex < posts.length - 1) {
            navigateToNextPost();
          }
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentMediaIndex, currentIndex, currentPost, posts.length]);

   useEffect(() => {
    if (post && isOpen) {
      // Reset comments state immediately when switching posts
      setComments([]);
      setCursor(undefined);
      setHasMore(true);
      setNewComment(""); // Also reset the comment input
      setCurrentPost(post);
      const index = posts.findIndex((p) => p.id === post.id);
      setCurrentIndex(index >= 0 ? index : 0);
      setCurrentMediaIndex(initialMediaIndex);

      // Load comments for the new post
      loadComments(false, post);
      // loadComments(hasMore, post );
    }
  }, [post, isOpen, posts, initialMediaIndex]);

  // ... existing code ...
  const loadComments = async (loadMore = false, targetPost?: PostDTO) => {
    const postToUse = targetPost || currentPost;
    if (!postToUse) return;

    setIsLoading(true);
    try {
      const data = (
        await CommunityService.fetchComments(
          postToUse.id,
          loadMore ? cursor : undefined
        )
      ).data;
      if (loadMore) {
        setComments((prev) => [...prev, ...data.comments]);
      } else {
        setComments(data.comments || []);
      }

      // Use backend pagination metadata
      setHasMore(data.hasMore);
      setCursor(data.nextCursor);
    } catch (error) {
      console.error("Failed to load comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

 

  // Cleanup effect when modal is closed
  useEffect(() => {
    if (!isOpen) {
      // Reset all state when modal is closed
      setComments([]);
      setCursor(undefined);
      setHasMore(true);
      setNewComment("");
      setCurrentPost(null);
      setCurrentIndex(0);
      setCurrentMediaIndex(0);
    }
  }, [isOpen]);

  // Pause video when navigating between posts or media
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [currentPost, currentMediaIndex]);
  // ... existing code ...

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const data = (
        await CommunityService.addComment(currentPost.id, newComment.trim())
      ).data;
      console.log(data);
      setComments((prev) => [data, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!currentPost) return;
    await CommunityService.toggleLike(currentPost.id);
    onLikeToggle(currentPost.id);
  };

  const navigateToNextMedia = () => {
    if (currentPost && currentMediaIndex < currentPost.media.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  };

  const navigateToPreviousMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  const navigateToNextPost = () => {
    if (currentIndex < posts.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextPost = posts[nextIndex];

      // Reset comments state for new post
      setComments([]);
      setCursor(undefined);
      setHasMore(true);
      setNewComment("");

      setCurrentIndex(nextIndex);
      setCurrentPost(nextPost);
      setCurrentMediaIndex(0);
      if (onNavigateToPost) {
        onNavigateToPost(nextPost.id);
      }
      loadComments(false, nextPost);
    }
  };

  const navigateToPreviousPost = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevPost = posts[prevIndex];

      // Reset comments state for new post
      setComments([]);
      setCursor(undefined);
      setHasMore(true);
      setNewComment("");

      setCurrentIndex(prevIndex);
      setCurrentPost(prevPost);
      setCurrentMediaIndex(0);
      if (onNavigateToPost) {
        onNavigateToPost(prevPost.id);
      }
      loadComments(false, prevPost);
    }
  };

  if (!currentPost) return null;

  return (
    <DialogCstm open={isOpen} onClose={onClose}>
      <DialogContentCstm className="max-w-5xl h-[85vh] p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Post Content - Left Side */}
          <div className="flex-1 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center relative">
            <ButtonCstm
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 h-10 w-10 p-0"
            >
              <X className="h-5 w-5" />
            </ButtonCstm>

            {/* Left Navigation - Media or Post */}
            {(currentMediaIndex > 0 || currentIndex > 0) && (
              <ButtonCstm
                variant="ghost"
                size="sm"
                onClick={
                  currentMediaIndex > 0
                    ? navigateToPreviousMedia
                    : navigateToPreviousPost
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white z-10 h-10 w-10 p-0"
              >
                <ChevronLeft className="h-6 w-6" />
              </ButtonCstm>
            )}

            {/* Right Navigation - Media or Post */}
            {((currentPost &&
              currentMediaIndex < currentPost.media.length - 1) ||
              currentIndex < posts.length - 1) && (
              <ButtonCstm
                variant="ghost"
                size="sm"
                onClick={
                  currentPost &&
                  currentMediaIndex < currentPost.media.length - 1
                    ? navigateToNextMedia
                    : navigateToNextPost
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white z-10 h-10 w-10 p-0"
              >
                <ChevronRight className="h-6 w-6" />
              </ButtonCstm>
            )}

            {/* Media Content */}
            {currentPost.media[currentMediaIndex]?.type === "image" ? (
              <img
                src={currentPost.media[currentMediaIndex].url}
                alt="Post"
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            ) : (
              <video
                ref={videoRef}
                src={currentPost.media[currentMediaIndex]?.url}
                controls
                className="max-h-full max-w-full rounded-lg"
                onPlay={handlePlay}
                onPause={handlePause}
              />
            )}

            {/* Media and Post Counter */}
            <div className="absolute top-4 right-16 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentPost.media.length > 1 && (
                <span>
                  {currentMediaIndex + 1}/{currentPost.media.length}
                </span>
              )}
              {posts.length > 1 && (
                <span className={currentPost.media.length > 1 ? "ml-2" : ""}>
                  Post {currentIndex + 1}/{posts.length}
                </span>
              )}
            </div>
          </div>

          {/* Comments Section - Right Side */}
          <div className="w-96 flex flex-col bg-white">
            {/* Post Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <AvatarCstm
                  src={currentPost.author?.profilePhotoUrl}
                  name={currentPost.author?.name || "User"}
                  role={currentPost.author?.role}
                  size="md"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900">
                      {currentPost.author?.name}
                    </h4>
                    {currentPost.author?.role === "trainer" && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full">
                        Trainer
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(currentPost.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {currentPost.caption && (
                <p className="text-gray-800 leading-relaxed">
                  {currentPost.caption}
                </p>
              )}
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <AvatarCstm
                    src={comment.author?.profilePhotoUrl}
                    name={comment.author?.name || "User"}
                    role={comment.author?.role}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        {comment.author?.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-800 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
                </div>
              )}

              {hasMore && !isLoading && (
                <ButtonCstm
                  variant="ghost"
                  size="sm"
                  onClick={() => loadComments(true)}
                  className="w-full"
                >
                  Load more comments
                </ButtonCstm>
              )}

              <div ref={commentsEndRef} />
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                <ButtonCstm
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`gap-2 ${currentPost.isLiked ? "text-red-600 bg-red-50" : "text-gray-600 hover:bg-red-50 hover:text-red-600"}`}
                >
                  <Heart
                    className={`h-5 w-5 ${currentPost.isLiked ? "fill-current" : ""}`}
                  />
                  <span className="font-medium">{currentPost.stats.likes}</span>
                </ButtonCstm>
                <ButtonCstm
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-gray-600"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-medium">
                    {currentPost.stats.comments}
                  </span>
                </ButtonCstm>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleSubmitComment} className="flex gap-2">
                <InputCstm
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewComment(e.target.value)
                  }
                  className="flex-1"
                  disabled={isSubmitting}
                />
                <ButtonCstm
                  type="submit"
                  size="sm"
                  disabled={!newComment.trim() || isSubmitting}
                  className="px-4"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </ButtonCstm>
              </form>
            </div>
          </div>
        </div>
      </DialogContentCstm>
    </DialogCstm>
  );
};

export default CommentModal;
