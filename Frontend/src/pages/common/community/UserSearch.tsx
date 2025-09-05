import { useState } from "react";
import { mockServices } from "./CommunityApp";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// User Search Component
const UserSearch = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    const res = await mockServices.searchUsers(query);
    setUsers(res.users || []);
    setIsSearching(false);
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      fitness_enthusiast: "bg-blue-100 text-blue-800",
      yoga_instructor: "bg-purple-100 text-purple-800",
      personal_trainer: "bg-green-100 text-green-800",
      nutritionist: "bg-orange-100 text-orange-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
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
            <Card key={user._id} className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 ring-2 ring-white shadow-md">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-medium text-lg">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg">{user.name}</h4>
                    <Badge variant="secondary" className={`mt-1 ${getRoleBadgeColor(user.role)}`}>
                      {user.role.replace('_', ' ')}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 hover:bg-purple-50 hover:text-purple-600">
                    <UserPlus className="h-4 w-4" />
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;