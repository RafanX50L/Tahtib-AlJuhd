import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Image, Play, UserCheck, UserPlus, Video, ArrowLeft } from "lucide-react";
import { PostDTO, ProfileDTO } from "@/types/community";
import { CommunityService } from "@/services/community.service";
import CommentModal from "@/components/community/CommentModal";

interface UserProfileProps {
  userId: string;
  onBack?: () => void;
}

// User Profile Component
const UserProfile: React.FC<UserProfileProps> = ({ userId, onBack }) => {
  const [posts, setPosts] = useState<PostDTO[] | []>([]);
  const [profile, setProfile] = useState<ProfileDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostDTO | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      const [postsData, profileData] = await Promise.all([
        (await CommunityService.fetchUserPosts(userId)).data,
        (await CommunityService.fetchUserProfile(userId)).data
      ]);
      setPosts(postsData.posts || []);
      setProfile(profileData);
      setIsLoading(false);
    };
    loadProfile();
  }, [userId]);

  const handleToggleFollow = async () => {
    if (!profile) return;
    
    if (profile.isFollowing) {
      await CommunityService.unfollow(profile.user.id);
      setProfile({ 
        ...profile, 
        isFollowing: false, 
        followers: Math.max(0, profile.followers - 1) 
      });
    } else {
      await CommunityService.follow(profile.user.id);
      setProfile({ 
        ...profile, 
        isFollowing: true, 
        followers: profile.followers + 1 
      });
    }
  };

  const handlePostClick = (post: PostDTO, mediaIndex: number = 0) => {
    setSelectedPost(post);
    setSelectedMediaIndex(mediaIndex);
    setShowCommentModal(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-gray-200 rounded-2xl"></div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Back Button */}
      {onBack && (
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Feed
          </Button>
        </div>
      )}

      {/* Profile Header */}
      {profile && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <CardContent className="p-6 -mt-16 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <Avatar className="h-32 w-32 ring-4 ring-white shadow-xl">
                <AvatarImage src={profile.user.profilePhotoUrl as string} alt={profile.user.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl font-bold">
                  {profile.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.user.name}</h1>
                <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
                  {profile.user.role.replace('_', ' ')}
                </Badge>
                
                <div className="flex justify-center md:justify-start gap-8 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
                    <div className="text-sm text-gray-500">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{profile.followers}</div>
                    <div className="text-sm text-gray-500">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{profile.following}</div>
                    <div className="text-sm text-gray-500">Following</div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleToggleFollow}
                className={`gap-2 px-6 ${
                  profile.isFollowing 
                    ? 'bg-gray-100 text-gray-900 hover:bg-gray-200' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                }`}
              >
                {profile.isFollowing ? (
                  <>
                    <UserCheck className="h-4 w-4" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Follow
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts Grid */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900">Posts</h2>
        </CardHeader>
        
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <FileText className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                When {profile?.user.name} shares their fitness journey, their posts will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  className="aspect-square overflow-hidden rounded-xl bg-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => handlePostClick(post, 0)}
                >
                  {post.media?.[0]?.type === "image" ? (
                    <div className="relative h-full">
                      <img 
                        src={post.media[0].url} 
                        alt="Post content"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <Image className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-full">
                      <video 
                        src={post.media[0].url} 
                        className="h-full w-full object-cover"
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <Play className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full p-1">
                        <Video className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
  );
};

export default UserProfile;