import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Heart, Image, MessageCircle, MoreHorizontal, Play } from "lucide-react";
import { fetchFeed, toggleLike, fetchPost } from "@/services/community.service";
import type { PostDTO } from "@/types/community";

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<PostDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [postModal, setPostModal] = useState<PostDTO | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchFeed();
      setPosts(data.posts || []);
    };
    load();
  }, []);

  useEffect(() => {
    const onScroll = async () => {
      if (isLoading || !hasMore) return;
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 400;
      if (nearBottom) {
        setIsLoading(true);
        const lastDate = posts[posts.length - 1]?.createdAt;
        const data = await fetchFeed(lastDate);
        const newPosts = data.posts || [];
        setPosts((prev) => [...prev, ...newPosts]);
        setHasMore(newPosts.length > 0);
        setIsLoading(false);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [posts, isLoading, hasMore]);

  const openPost = async (postId: string) => {
    const data = await fetchPost(postId);
    setPostModal(data);
  };

  return (
    <>
      {posts.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="p-12 text-center">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <Image className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to the Community!</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">Connect with others and share your journey.</p>
          </CardContent>
        </Card>
      ) : (
        posts.map((p) => (
          <Card key={p.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
                    <AvatarImage src={p.author?.profilePhotoUrl || undefined} alt={p.author?.name || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                      {(p.author?.name || 'U').charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900">{p.author?.name || 'User'}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(p.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {p.caption && <p className="text-gray-800 mb-4 leading-relaxed">{p.caption}</p>}
              <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `repeat(${Math.min(p.media.length, 2)}, 1fr)` }}>
                {p.media.map((m, idx) => (
                  <div key={idx} className="relative overflow-hidden rounded-xl bg-gray-100" onClick={() => openPost(p.id)}>
                    {m.type === "image" ? (
                      <img src={m.url} alt="Post" className="w-full h-auto object-cover" />
                    ) : (
                      <video src={m.url} className="w-full rounded-xl" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className={`gap-2 hover:bg-red-50 hover:text-red-600`} onClick={() => toggleLike(p.id)}>
                    <Heart className="h-4 w-4" />{p.stats.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2 hover:bg-blue-50 hover:text-blue-600">
                    <MessageCircle className="h-4 w-4" />{p.stats.comments}
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">Share</Button>
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

      {postModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setPostModal(null)}>
          <div className="bg-white rounded-xl max-w-3xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-black">
                {postModal.media[0]?.type === 'image' ? (
                  <img src={postModal.media[0].url} className="w-full h-full object-contain" />
                ) : (
                  <video src={postModal.media[0]?.url} controls className="w-full h-full" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={postModal.author?.profilePhotoUrl || undefined} />
                    <AvatarFallback>{(postModal.author?.name || 'U').charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{postModal.author?.name || 'User'}</div>
                    <div className="text-xs text-gray-500">{new Date(postModal.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                {postModal.caption && <div className="mb-3 text-gray-800">{postModal.caption}</div>}
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-600">{postModal.stats.likes} likes</span>
                  <span className="text-sm text-gray-600">{postModal.stats.comments} comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Feed;


