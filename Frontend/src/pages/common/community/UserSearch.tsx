import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SearchUserDTO } from "@/types/community";
import { CommunityService } from "@/services/community.service";

interface UserSearchProps {
  onUserClick: (userId: string) => void;
}

// User Search Component
const UserSearch: React.FC<UserSearchProps> = ({ onUserClick }) => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<SearchUserDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>();

  const loadUsers = useCallback(async (loadMore = false) => {
    if (!query.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      const res = (await CommunityService.searchUsers(query, loadMore ? cursor : undefined)).data;
      if (loadMore) {
        setUsers(prev => [...prev, ...res.users]);
      } else {
        setUsers(res.users || []);
      }
      
      // Use backend pagination metadata
      setHasMore(res.hasMore);
      setCursor(res.nextCursor);
    } catch (error) {
      console.error("Failed to search users:", error);
    } finally {
      setIsLoading(false);
    }
  }, [query, cursor, isLoading]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    setUsers([]);
    setCursor(undefined);
    setHasMore(true);
    await loadUsers();
    setIsSearching(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || !hasMore || !query.trim()) return;
      
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 400;
      if (nearBottom) {
        loadUsers(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadUsers, isLoading, hasMore, query]);

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      client: "bg-blue-100 text-blue-800",
      trainer: "bg-green-100 text-green-800",
      admin: "bg-purple-100 text-purple-800",
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const handleToggleFollow = async (userId: string, isFollowing: boolean) => {
    try {
      if (isFollowing) {
        await CommunityService.unfollow(userId);
      } else {
        await CommunityService.follow(userId);
      }
      setUsers(prev => prev.map(user => 
        user._id === userId 
          ? { ...user, isFollowing: !isFollowing, followersCount: isFollowing ? user.followersCount - 1 : user.followersCount + 1 }
          : user
      ));
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };


  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Search className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Find People</h2>
              <p className="text-sm text-gray-500">Connect with fitness enthusiasts in your community</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1">
              <Input 
                placeholder="Search by name, expertise, or interests..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSearching}
              className="gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {users.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="p-12 text-center">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Discover Amazing People</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Search for trainers, nutritionists, or fellow fitness enthusiasts to expand your network.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Card 
              key={user._id} 
              className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="flex items-center gap-4 flex-1 cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors"
                    onClick={() => onUserClick(user._id)}
                  >
                    <Avatar className="h-14 w-14 ring-2 ring-white shadow-md">
                      <AvatarImage src={user.profilePhotoUrl || undefined} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-medium text-lg">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg">{user.name}</h4>
                      <Badge variant="secondary" className={`mt-1 ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </Badge>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span>{user.followersCount} followers</span>
                        <span>{user.postsCount} posts</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant={user.isFollowing ? "outline" : "default"}
                    size="sm" 
                    className={`gap-2 ${
                      user.isFollowing 
                        ? 'hover:bg-red-50 hover:text-red-600 hover:border-red-300' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                    onClick={() => handleToggleFollow(user._id, user.isFollowing)}
                  >
                    <UserPlus className="h-4 w-4" />
                    {user.isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default UserSearch;