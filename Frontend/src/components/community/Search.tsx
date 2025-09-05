import { useCallback, useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, UserPlus } from "lucide-react";
import { searchUsers } from "@/services/community.service";
import { useNavigate } from "react-router-dom";

const Search: React.FC = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [users, setUsers] = useState<Array<{ id: string; name: string; role: string; profilePhotoUrl?: string | null }>>([]);
  const navigate = useNavigate();

  const debouncedSearch = useMemo(() => {
    let t: number | undefined;
    return (q: string) => {
      window.clearTimeout(t);
      t = window.setTimeout(async () => {
        if (!q.trim()) { setUsers([]); return; }
        setIsSearching(true);
        const res = await searchUsers(q);
        const mapped = (res.users || []).map((u: any) => ({ id: u._id || u.id, name: u.name, role: u.role, profilePhotoUrl: u.profilePhotoUrl }));
        setUsers(mapped);
        setIsSearching(false);
      }, 400);
    };
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    debouncedSearch(q);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <SearchIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Find People</h2>
              <p className="text-sm text-gray-500">Connect with fitness enthusiasts in your community</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Input placeholder="Search by name..." value={query} onChange={onChange} className="border-gray-200 focus:border-purple-500 focus:ring-purple-500" />
        </CardContent>
      </Card>

      {isSearching && <div className="p-2 text-center text-sm text-gray-500">Searching...</div>}

      {users.length === 0 && !isSearching ? (
        <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="p-12 text-center">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <SearchIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Discover Amazing People</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">Search for trainers or clients to expand your network.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id} onClick={() => navigate(`/profile/${user.id}`)} className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 ring-2 ring-white shadow-md">
                    <AvatarImage src={user.profilePhotoUrl || undefined} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-medium text-lg">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg">{user.name}</h4>
                    <Badge variant="secondary" className="mt-1 capitalize">{user.role}</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 hover:bg-purple-50 hover:text-purple-600"><UserPlus className="h-4 w-4" />Connect</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;


