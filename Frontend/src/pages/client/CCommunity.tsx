import { useState, useEffect } from 'react';
import Sidebar from '../../components/client/Sidebar';
import Header from '../../components/client/Header';
import CFooter from '@/components/client/Footer';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus, 
  Image, 
  Video, 
  Hash,
  Filter,
  Search,
  TrendingUp,
  Target,
  Dumbbell,
  Users,
  Award
} from 'lucide-react';
import { toast } from 'sonner';

interface CommunityPost {
  _id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorType: 'client' | 'trainer';
  contentType: 'progress' | 'workout' | 'motivation' | 'question' | 'achievement' | 'general';
  title?: string;
  content: string;
  media?: Array<{
    type: 'image' | 'video';
    url: string;
    caption?: string;
  }>;
  tags: string[];
  likes: string[];
  comments: Array<{
    _id: string;
    authorId: string;
    authorName: string;
    authorType: 'client' | 'trainer';
    content: string;
    createdAt: string;
  }>;
  viewCount: number;
  createdAt: string;
  isLiked: boolean;
}

const CCommunity = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    contentType: 'general' as const,
    tags: [] as string[],
    media: [] as Array<{ type: 'image' | 'video'; url: string; caption?: string }>
  });
  const [tagInput, setTagInput] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    const mockPosts: CommunityPost[] = [
      {
        _id: '1',
        authorId: 'user1',
        authorName: 'Sarah Johnson',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        authorType: 'client',
        contentType: 'achievement',
        title: 'Reached my weight loss goal! 🎉',
        content: 'After 6 months of consistent training and healthy eating, I finally reached my goal weight! Lost 25 pounds and gained so much confidence. Thank you to my amazing trainer and this supportive community!',
        tags: ['weightloss', 'achievement', 'motivation'],
        likes: ['user1', 'user2'],
        comments: [
          {
            _id: 'c1',
            authorId: 'user2',
            authorName: 'Mike Chen',
            authorType: 'client',
            content: 'Congratulations! This is amazing progress!',
            createdAt: '2024-01-15T10:30:00Z'
          }
        ],
        viewCount: 156,
        createdAt: '2024-01-15T09:00:00Z',
        isLiked: true
      },
      {
        _id: '2',
        authorId: 'trainer1',
        authorName: 'Coach Alex',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        authorType: 'trainer',
        contentType: 'workout',
        title: 'Quick HIIT Circuit for Busy People',
        content: 'Here\'s a 15-minute HIIT circuit you can do anywhere! Perfect for those busy days when you can\'t make it to the gym. Try this 3 times through with 30 seconds rest between rounds.',
        media: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
            caption: 'HIIT Circuit Workout'
          }
        ],
        tags: ['hiit', 'workout', 'fitness'],
        likes: ['user1', 'user3', 'user4'],
        comments: [],
        viewCount: 89,
        createdAt: '2024-01-14T16:00:00Z',
        isLiked: false
      },
      {
        _id: '3',
        authorId: 'user3',
        authorName: 'Emma Davis',
        authorType: 'client',
        contentType: 'progress',
        title: 'Progress Update - Week 8',
        content: 'Feeling stronger every day! My squat weight has increased from 95lbs to 135lbs. Consistency really is key. Keep pushing everyone! 💪',
        media: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
            caption: 'Progress photo'
          }
        ],
        tags: ['progress', 'strength', 'squats'],
        likes: ['user1', 'user2', 'trainer1'],
        comments: [
          {
            _id: 'c2',
            authorId: 'trainer1',
            authorName: 'Coach Alex',
            authorType: 'trainer',
            content: 'Great progress Emma! Your form has improved significantly too.',
            createdAt: '2024-01-14T14:20:00Z'
          }
        ],
        viewCount: 203,
        createdAt: '2024-01-14T12:00:00Z',
        isLiked: true
      }
    ];

    setPosts(mockPosts);
    setIsLoading(false);
  }, []);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post._id === postId) {
        const isLiked = post.isLiked;
        const likes = isLiked 
          ? post.likes.filter(id => id !== user?._id)
          : [...post.likes, user?._id || ''];
        
        return {
          ...post,
          likes,
          isLiked: !isLiked
        };
      }
      return post;
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newPost.tags.includes(tagInput.trim())) {
      setNewPost(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleCreatePost = () => {
    if (!newPost.content.trim()) {
      toast.error('Please write some content for your post');
      return;
    }

    const post: CommunityPost = {
      _id: Date.now().toString(),
      authorId: user?._id || '',
      authorName: user?.name || 'Anonymous',
      authorAvatar: user?.profilePicture,
      authorType: user?.role as 'client' | 'trainer',
      contentType: newPost.contentType,
      title: newPost.title,
      content: newPost.content,
      media: newPost.media,
      tags: newPost.tags,
      likes: [],
      comments: [],
      viewCount: 0,
      createdAt: new Date().toISOString(),
      isLiked: false
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({
      title: '',
      content: '',
      contentType: 'general',
      tags: [],
      media: []
    });
    setShowCreatePost(false);
    toast.success('Post created successfully!');
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'progress': return <TrendingUp className="w-4 h-4" />;
      case 'workout': return <Dumbbell className="w-4 h-4" />;
      case 'achievement': return <Award className="w-4 h-4" />;
      case 'motivation': return <Target className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'progress': return 'bg-blue-500';
      case 'workout': return 'bg-green-500';
      case 'achievement': return 'bg-yellow-500';
      case 'motivation': return 'bg-purple-500';
      case 'question': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesFilter = filterType === 'all' || post.contentType === filterType;
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="bg-[#12151E] text-white min-h-screen font-sans">
        <Sidebar />
        <main className="lg:ml-[280px] p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#12151E] text-white min-h-screen font-sans">
      <Sidebar />
      <main className="lg:ml-[280px] p-8">
        <Header
          title="Community"
          content="Connect with fellow fitness enthusiasts and share your journey"
        />

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search posts, tags, or users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            >
              <option value="all">All Posts</option>
              <option value="progress">Progress</option>
              <option value="workout">Workouts</option>
              <option value="motivation">Motivation</option>
              <option value="achievement">Achievements</option>
              <option value="question">Questions</option>
            </select>
            <Button
              onClick={() => setShowCreatePost(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </div>
        </div>

        {/* Create Post Modal */}
        {showCreatePost && (
          <Card className="mb-8 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Create a New Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Post Type</label>
                <select
                  value={newPost.contentType}
                  onChange={(e) => setNewPost(prev => ({ ...prev, contentType: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="general">General</option>
                  <option value="progress">Progress</option>
                  <option value="workout">Workout</option>
                  <option value="motivation">Motivation</option>
                  <option value="achievement">Achievement</option>
                  <option value="question">Question</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Title (Optional)</label>
                <Input
                  placeholder="Add a title..."
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <Textarea
                  placeholder="Share your fitness journey, ask questions, or motivate others..."
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add tags..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Button onClick={handleAddTag} variant="outline" className="border-gray-600">
                    <Hash className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newPost.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-blue-600 hover:bg-blue-700">
                      #{tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-400"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreatePost} className="bg-blue-600 hover:bg-blue-700">
                  Post
                </Button>
                <Button 
                  onClick={() => setShowCreatePost(false)} 
                  variant="outline" 
                  className="border-gray-600"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {filteredPosts.map(post => (
            <Card key={post._id} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={post.authorAvatar} />
                      <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{post.authorName}</span>
                        <Badge 
                          variant="secondary" 
                          className={`${post.authorType === 'trainer' ? 'bg-purple-600' : 'bg-blue-600'}`}
                        >
                          {post.authorType}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`${getContentTypeColor(post.contentType)} border-transparent text-white`}
                        >
                          {getContentTypeIcon(post.contentType)}
                          <span className="ml-1 capitalize">{post.contentType}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {post.title && (
                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                )}
                
                <p className="text-gray-300 mb-4">{post.content}</p>

                {post.media && post.media.length > 0 && (
                  <div className="mb-4">
                    {post.media.map((media, index) => (
                      <div key={index} className="mb-2">
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt={media.caption || 'Post media'}
                            className="rounded-lg max-w-full h-auto"
                          />
                        ) : (
                          <video
                            src={media.url}
                            controls
                            className="rounded-lg max-w-full"
                          />
                        )}
                        {media.caption && (
                          <p className="text-sm text-gray-400 mt-1">{media.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="border-gray-600">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center space-x-1 ${
                        post.isLiked ? 'text-red-500' : 'text-gray-400'
                      } hover:text-red-500 transition-colors`}
                    >
                      <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes.length}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.comments.length}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-green-500 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    {post.viewCount} views
                  </div>
                </div>

                {post.comments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <h4 className="font-semibold mb-2">Comments</h4>
                    <div className="space-y-3">
                      {post.comments.map(comment => (
                        <div key={comment._id} className="flex items-start space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{comment.authorName}</span>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${comment.authorType === 'trainer' ? 'bg-purple-600' : 'bg-blue-600'}`}
                              >
                                {comment.authorType}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-300">{comment.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No posts found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        <CFooter />
      </main>
    </div>
  );
};

export default CCommunity;
