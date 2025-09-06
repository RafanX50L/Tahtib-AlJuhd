import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Home, Plus, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import CommunityFeed from "./communityFeed";
import CreatePost from "./createPost";
import UserSearch from "./UserSearch";
import UserProfile from "./UserProfile";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import logo from '@/assets/images/logo.jpg';

// Modern UI Components
const AvatarCstm = ({ src, name, size = "md", className = "", role }: {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  role?: "client" | "trainer" | "admin";
}) => {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm", 
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg"
  };

  const roleColors = {
    client: "from-blue-500 to-cyan-500",
    trainer: "from-purple-500 to-pink-500", 
    admin: "from-orange-500 to-red-500"
  };

  const ringColors = {
    client: "ring-blue-200",
    trainer: "ring-purple-200",
    admin: "ring-orange-200"
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden ring-2 ${role ? ringColors[role] : 'ring-gray-200'} shadow-lg flex-shrink-0 ${className}`}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${role ? roleColors[role] : 'from-gray-400 to-gray-600'} flex items-center justify-center text-white font-semibold`}>
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

const ButtonCstm = ({ children, variant = "primary", size = "md", className = "", disabled = false, onClick, icon, ...props }: {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  [key: string]: any;
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl focus:ring-purple-500 hover:scale-105",
    secondary: "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md focus:ring-gray-500",
    ghost: "hover:bg-gray-100 text-gray-600 hover:text-gray-900 hover:scale-105",
    danger: "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl focus:ring-red-500 hover:scale-105",
    success: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl focus:ring-green-500 hover:scale-105"
  };
  
  const sizes = {
    xs: "px-2.5 py-1.5 text-xs gap-1",
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-3"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon && icon}
      {children}
    </button>
  );
};

const InputCstm = ({ className = "", ...props }: {
  className?: string;
  [key: string]: any;
}) => (
  <input
    className={`w-full px-4 py-3 bg-gray-50/80 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${className}`}
    {...props}
  />
);

const DialogCstm = ({ open, onClose, children }: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative z-10 max-w-full max-h-full animate-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  );
};

const DialogContentCstm = ({ children, className = "" }: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-white rounded-3xl shadow-2xl border border-gray-100 ${className}`}>
    {children}
  </div>
);
const CardCstm = ({ children, className = "", hover = false }: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) => (
  <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 ${hover ? 'hover:shadow-2xl hover:-translate-y-1 transition-all duration-300' : ''} ${className}`}>
    {children}
  </div>
);

export { AvatarCstm, ButtonCstm, InputCstm, DialogCstm, DialogContentCstm, CardCstm};
// Main App Component
const CommunityApp = () => {
  const [currentView, setCurrentView] = useState<'feed' | 'create' | 'search' | 'profile'>('feed');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { user } = useSelector((s:RootState)=> s.auth);
  const dashboardlink = user?.role === 'client' ? '/dashboard' : '/trainer/dashboard';
  const navigate = useNavigate();
  
  const renderView = () => {
    switch (currentView) {
      case 'feed':
        return <CommunityFeed onUserClick={handleUserClick} />;
      case 'create':
        return <CreatePost />;
      case 'search':
        return <UserSearch onUserClick={handleUserClick} />;
      case 'profile':
        return <UserProfile 
          userId={selectedUserId || user?._id as string} 
          onBack={selectedUserId ? () => setCurrentView('feed') : undefined}
        />;
      default:
        return <CommunityFeed onUserClick={handleUserClick} />;
    }
  };

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentView('profile');
  };

  const handleMyProfileClick = () => {
    setSelectedUserId(null); // Reset to show current user's profile
    setCurrentView('profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src={logo} alt="Logo" className="w-15 h-15 rounded-full" />
              <span className="font-bold text-xl text-gray-900">Tahtib AlJuhd Community</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant='ghost'
                size="sm"
                onClick={() => navigate(dashboardlink) }
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
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
                variant={currentView === 'profile' && !selectedUserId ? 'default' : 'ghost'}
                size="sm"
                onClick={handleMyProfileClick}
                className="gap-2"
              >
                <Avatar className="h-4 w-4">
                  <AvatarFallback className="text-xs">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                My Profile
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