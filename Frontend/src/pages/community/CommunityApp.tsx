import { Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { Users, Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Feed = lazy(() => import("@/components/community/Feed"));

const CommunityApp: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
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
            <Link to="/search">
              <Button variant="outline" size="sm" className="gap-2">
                <Search className="h-4 w-4" />
                Discover
              </Button>
            </Link>
            <Link to="/community/create">
              <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="h-4 w-4" />
                Create
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="p-6 text-center">Loading feed...</div>}>
        <Feed />
      </Suspense>
    </div>
  );
};

export default CommunityApp;


