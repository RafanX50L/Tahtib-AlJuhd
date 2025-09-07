import React, { useEffect, useState, useCallback } from "react";
import { Heart, Image, MessageCircle, MoreHorizontal, Play, Plus, Search, Users, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { PostDTO } from "@/types/community";
import CommentModal from "@/components/community/CommentModal";
import { AvatarCstm, ButtonCstm, CardCstm } from "./CommunityApp";
import { Button } from "@/components/ui/button";
import { CommunityService } from "@/services/community.service";
import { useVideoManager } from "@/hooks/useVideoManager";




interface PostCardProps {
  post: PostDTO;
  onUserClick: (userId: string) => void;
  onLike: (postId: string, isLiked: boolean) => void;
  onComment: (post: PostDTO, mediaIndex: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onUserClick, onLike, onComment }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const { videoRef, handlePlay, handlePause } = useVideoManager();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Pause video when switching between media
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [currentMediaIndex]);

  const media = post.media[currentMediaIndex];

  return (
    <CardCstm className="overflow-hidden" hover>
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 -m-3 rounded-xl transition-all duration-200"
            onClick={() => onUserClick(post.authorId)}
          >
            <AvatarCstm 
              src={post.author?.profilePhotoUrl} 
              name={post.author?.name || "User"} 
              role={post.author?.role}
              size="lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-gray-900">{post.author?.name}</h4>
                {post.author?.role === 'trainer' && (
                  <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full">
                    Trainer
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-3 w-3" />
                {formatDate(post.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Post Caption */}
      {post.caption && (
        <div className="px-6 pb-4">
          <p className="text-gray-800 leading-relaxed">{post.caption}</p>
        </div>
      )}
      
      {/* Post Media */}
      {post.media.length > 0 && (
        <div className="px-6 pb-4">
          <div className="relative">
            <div 
              className="relative overflow-hidden rounded-xl bg-gray-100 cursor-pointer group"
              onClick={() => onComment(post, currentMediaIndex)}
            >
              {media.type === "image" ? (
                <div className="relative">
                  <img 
                    src={media.url} 
                    alt="Post content"
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Image className="h-4 w-4 text-white" />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <video 
                    ref={videoRef}
                    src={media.url} 
                    controls 
                    className="w-full rounded-lg"
                    preload="metadata"
                    onPlay={handlePlay}
                    onPause={handlePause}
                  />
                  <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm rounded-full p-2">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
            </div>

            {post.media.length > 1 && currentMediaIndex > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 h-10 w-10 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentMediaIndex(prev => prev - 1);
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}

            {post.media.length > 1 && currentMediaIndex < post.media.length - 1 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 h-10 w-10 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentMediaIndex(prev => prev + 1);
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}
          </div>

          {post.media.length > 1 && (
            <div className="flex justify-center space-x-2 mt-2">
              {post.media.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 w-2 rounded-full ${i === currentMediaIndex ? 'bg-purple-600' : 'bg-gray-300'}`} 
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <ButtonCstm 
              variant="ghost" 
              size="sm" 
              className={`gap-2 hover:bg-red-50 hover:text-red-600 transition-all duration-200 ${post.isLiked ? 'text-red-600 bg-red-50' : ''}`}
              onClick={() => onLike(post.id, post.isLiked || false)}
            >
              <Heart className={`h-5 w-5 transition-all duration-200 ${post.isLiked ? 'fill-current scale-110' : ''}`} />
              <span className="font-medium">{post.stats.likes}</span>
            </ButtonCstm>
            <ButtonCstm 
              variant="ghost" 
              size="sm" 
              className="gap-2 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              onClick={() => onComment(post, currentMediaIndex)}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">{post.stats.comments}</span>
            </ButtonCstm>
          </div>
        </div>
      </div>
    </CardCstm>
  );
};

// Modern Community Feed Component
interface CommunityFeedProps {
  onUserClick: (userId: string) => void;
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({ onUserClick }) => {
  const [posts, setPosts] = useState<PostDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>();
  const [selectedPost, setSelectedPost] = useState<PostDTO | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);

  const loadFeed = useCallback(async (loadMore = false) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const data = (await CommunityService.fetchFeed(loadMore ? cursor : undefined)).data;
      if (loadMore) {
        setPosts(prev => [...prev, ...data.posts]);
      } else {
        setPosts(data.posts || []);
      }
      setHasMore(data.hasMore);
      setCursor(data.nextCursor);
    } catch (error) {
      console.error("Failed to load feed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [cursor, isLoading]);

  useEffect(() => {
    loadFeed();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || !hasMore) return;
      
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 400;
      if (nearBottom) {
        loadFeed(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadFeed, isLoading, hasMore]);

  const handleLike = async (postId: string, isLiked: boolean) => {
    try {
      await CommunityService.toggleLike(postId);
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              isLiked: !isLiked, 
              stats: { 
                ...p.stats, 
                likes: isLiked ? p.stats.likes - 1 : p.stats.likes + 1 
              }
            }
          : p
      ));
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleCommentClick = (post: PostDTO, mediaIndex: number) => {
    setSelectedPost(post);
    setSelectedMediaIndex(mediaIndex);
    setShowCommentModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-2xl mx-auto space-y-6 p-4">
        {/* Posts */}
        {posts.length === 0 && !isLoading ? (
          <CardCstm className="border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/50" hover>
            <div className="p-12 text-center">
              <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <Users className="h-10 w-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Welcome to the Community!
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                Connect with fellow fitness enthusiasts, share your progress, and get inspired by others' journeys{/* eslint-disable-line */}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ButtonCstm icon={<Plus className="h-4 w-4" />}>``
                  Create your first post
                </ButtonCstm>
                <ButtonCstm variant="secondary" icon={<Search className="h-4 w-4" />}>
                  Find people to follow
                </ButtonCstm>
              </div>
            </div>
          </CardCstm>
        ) : (
          posts.map((post) => (
            <PostCard 
              key={post.id}
              post={post}
              onUserClick={onUserClick}
              onLike={handleLike}
              onComment={handleCommentClick}
            />
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center p-8">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
          </div>
        )}

        {/* Comment Modal */}
        <CommentModal
          post={selectedPost}
          posts={posts}
          isOpen={showCommentModal}
          onClose={() => setShowCommentModal(false)}
          onLikeToggle={(postId) => {
            setPosts(prev => prev.map(p => 
              p.id === postId 
                ? { ...p, isLiked: !p.isLiked, stats: { ...p.stats, likes: p.isLiked ? p.stats.likes - 1 : p.stats.likes + 1 }}
                : p
            ));
          }}
          onNavigateToPost={(postId) => {
            const post = posts.find(p => p.id === postId);
            if (post) {
              setSelectedPost(post);
            }
          }}
          initialMediaIndex={selectedMediaIndex}
        />
      </div>
    </div>
  );
};

export default CommunityFeed;