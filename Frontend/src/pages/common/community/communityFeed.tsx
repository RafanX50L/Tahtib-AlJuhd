import { useEffect, useState } from "react";
import { mockServices } from "./CommunityApp";
import { PostDTO } from "@/types/community";
import { Heart, Image, MessageCircle, MoreHorizontal, Play, Plus, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Calendar from "react-calendar";

const CommunityFeed = () => {
  const [posts, setPosts] = useState< PostDTO[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadFeed = async () => {
      setIsLoading(true);
      const data = await mockServices.fetchFeed();
      setPosts(data.posts || []);
      setIsLoading(false);
    };
    loadFeed();
  }, []);

  const handleLike = async (postId, isLiked) => {
    await mockServices.toggleLike(postId);
    setPosts(posts.map(p => 
      p._id === postId 
        ? { ...p, isLiked: !isLiked, likesCount: isLiked ? p.likesCount - 1 : p.likesCount + 1 }
        : p
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md rounded-2xl border p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Community</h1>
              <p className="text-sm text-gray-500">Stay connected with your fitness family</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Search className="h-4 w-4" />
              Discover
            </Button>
            <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="h-4 w-4" />
              Create
            </Button>
          </div>
        </div>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="p-12 text-center">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <Users className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to the Community!</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Connect with fellow fitness enthusiasts, share your progress, and get inspired by others' journeys.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create your first post
              </Button>
              <Button variant="outline" className="gap-2">
                <Search className="h-4 w-4" />
                Find people to follow
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        posts.map((post) => (
          <Card key={post._id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
                    <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                      {post.authorName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900">{post.authorName}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.createdAt)}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {post.caption && (
                <p className="text-gray-800 mb-4 leading-relaxed">{post.caption}</p>
              )}
              
              <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `repeat(${Math.min(post.media.length, 2)}, 1fr)` }}>
                {post.media.map((media, idx) => (
                  <div key={idx} className="relative overflow-hidden rounded-xl bg-gray-100">
                    {media.type === "image" ? (
                      <div className="relative group">
                        <img 
                          src={media.url} 
                          alt="Post content"
                          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105" 
                        />
                        <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Image className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="relative group">
                        <video 
                          src={media.url} 
                          controls 
                          className="w-full rounded-xl"
                          poster="/api/placeholder/600/400"
                        />
                        <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm rounded-full p-1.5">
                          <Play className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`gap-2 hover:bg-red-50 hover:text-red-600 ${post.isLiked ? 'text-red-600 bg-red-50' : ''}`}
                    onClick={() => handleLike(post._id, post.isLiked)}
                  >
                    <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                    {post.likesCount}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2 hover:bg-blue-50 hover:text-blue-600">
                    <MessageCircle className="h-4 w-4" />
                    {post.commentsCount}
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {isLoading && (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;