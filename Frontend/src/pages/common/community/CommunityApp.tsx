import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Plus, Search, Users } from "lucide-react";
import { useState } from "react";
import CommunityFeed from "./communityFeed";
import CreatePost from "./createPost";
import UserSearch from "./UserSearch";
import UserProfile from "./UserProfile";
export const mockServices = {
  fetchFeed: async (lastDate?: string) => ({
    posts: [
      {
        _id: "1",
        authorId: "user1",
        authorName: "John Doe",
        authorAvatar: "/api/placeholder/40/40",
        caption: "Just finished an amazing workout session! Feeling stronger every day 💪 #FitnessJourney",
        media: [
          { key: "1", type: "image", mimeType: "image/jpeg", url: "/api/placeholder/600/400" }
        ],
        likesCount: 24,
        commentsCount: 8,
        isLiked: false,
        createdAt: new Date().toISOString()
      },
      {
        _id: "2", 
        authorId: "user2",
        authorName: "Sarah Wilson",
        authorAvatar: "/api/placeholder/40/40",
        caption: "Morning yoga session in the park 🧘‍♀️ Starting the day with mindfulness",
        media: [
          { key: "2", type: "video", mimeType: "video/mp4", url: "/api/placeholder/600/400" }
        ],
        likesCount: 31,
        commentsCount: 12,
        isLiked: true,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  }),
  toggleLike: async (postId: string) => Promise.resolve(),
  addComment: async (postId: string, content: string) => Promise.resolve(),
  createPost: async (formData: FormData) => Promise.resolve(),
  searchUsers: async (query: string) => ({
    users: [
      { _id: "1", name: "John Doe", role: "fitness_enthusiast", avatar: "/api/placeholder/40/40" },
      { _id: "2", name: "Sarah Wilson", role: "yoga_instructor", avatar: "/api/placeholder/40/40" },
      { _id: "3", name: "Mike Johnson", role: "personal_trainer", avatar: "/api/placeholder/40/40" }
    ]
  }),
  fetchUserProfile: async (userId: string) => ({
    user: { _id: userId, name: "John Doe", role: "fitness_enthusiast", profilePhotoUrl: "/api/placeholder/80/80" },
    followers: 156,
    following: 89,
    isFollowing: false
  }),
  fetchUserPosts: async (userId: string) => ({
    posts: [
      { _id: "1", media: [{ type: "image", url: "/api/placeholder/300/300" }] },
      { _id: "2", media: [{ type: "image", url: "/api/placeholder/300/300" }] },
      { _id: "3", media: [{ type: "video", url: "/api/placeholder/300/300" }] }
    ]
  }),
  follow: async (userId: string) => Promise.resolve(),
  unfollow: async (userId: string) => Promise.resolve()
};
// Main App Component
const CommunityApp = () => {
  const [currentView, setCurrentView] = useState<'feed' | 'create' | 'search' | 'profile'>('feed');

  const renderView = () => {
    switch (currentView) {
      case 'feed':
        return <CommunityFeed />;
      case 'create':
        return <CreatePost />;
      case 'search':
        return <UserSearch />;
      case 'profile':
        return <UserProfile userId="1" />;
      default:
        return <CommunityFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">FitCommunity</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={currentView === 'feed' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('feed')}
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                Feed
              </Button>
              <Button
                variant={currentView === 'search' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('search')}
                className="gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
              <Button
                variant={currentView === 'create' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('create')}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create
              </Button>
              <Button
                variant={currentView === 'profile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('profile')}
                className="gap-2"
              >
                <Avatar className="h-4 w-4">
                  <AvatarFallback className="text-xs">JD</AvatarFallback>
                </Avatar>
                Profile
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-6">
        {renderView()}
      </main>
    </div>
  );
};

export default CommunityApp;