import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSocket } from "@/hooks/socketio";
import { chatEnum } from "@/lib/chat-enum";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bell,
  Check,
  X,
  MessageCircle,
  Calendar,
  AlertCircle,
  Settings,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  ArrowLeft,
  RefreshCw,
  DollarSign,
  Users,
  Star,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { NotificationServices } from "@/services/implementation/NotificationServices";
import { cn } from "@/lib/utils";

export interface INotificationView {
  id: string;            // unique identifier
  sender: string;        // who sent it
  receiver?: string;     // who receives it (optional for role-based)
  role?: string;         // role of receiver (user, admin, trainer)
  text: string;          // notification message
  category: string;      // notification category/type
  date: Date;            // ISO date string for createdAt
  isRead: boolean;       // read/unread status
}

export interface Theme {
  background: string;
  cardBackground: string;
  border: string;
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  error: string;
  success: string;
  warning: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  hoverBackground: string;
  selectBackground: string;
  gradient: string;
  cardGradient: string;
  shadow: string;
  glassmorphism: string;
}

export const trainerTheme: Theme = {
  background: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
  cardBackground: "bg-gradient-to-br from-slate-800/80 to-purple-800/20 backdrop-blur-xl",
  border: "border-purple-500/30",
  primary: "text-purple-400",
  primaryHover: "hover:text-purple-300",
  secondary: "text-violet-400",
  accent: "text-fuchsia-400",
  error: "text-red-400",
  success: "text-emerald-400",
  warning: "text-amber-400",
  textPrimary: "text-white",
  textSecondary: "text-slate-300",
  textMuted: "text-slate-400",
  hoverBackground: "hover:bg-purple-800/30",
  selectBackground: "bg-purple-700/20 border-purple-400/50",
  gradient: "bg-gradient-to-r from-purple-600 to-fuchsia-600",
  cardGradient: "bg-gradient-to-br from-purple-600/10 to-fuchsia-600/10",
  shadow: "shadow-2xl shadow-purple-500/20",
  glassmorphism: "bg-white/5 backdrop-blur-md border-white/10"
};

export const clientTheme: Theme = {
  background: "bg-gradient-to-br from-blue-950 via-indigo-900 to-cyan-950",
  cardBackground: "bg-gradient-to-br from-blue-800/60 to-cyan-800/20 backdrop-blur-xl",
  border: "border-cyan-400/30",
  primary: "text-cyan-400",
  primaryHover: "hover:text-cyan-300",
  secondary: "text-blue-400",
  accent: "text-teal-400",
  error: "text-rose-400",
  success: "text-green-400",
  warning: "text-yellow-400",
  textPrimary: "text-white",
  textSecondary: "text-blue-200",
  textMuted: "text-blue-300",
  hoverBackground: "hover:bg-cyan-800/30",
  selectBackground: "bg-cyan-700/20 border-cyan-400/50",
  gradient: "bg-gradient-to-r from-cyan-500 to-blue-600",
  cardGradient: "bg-gradient-to-br from-cyan-500/10 to-blue-600/10",
  shadow: "shadow-2xl shadow-cyan-500/20",
  glassmorphism: "bg-white/5 backdrop-blur-md border-white/10"
};

export const adminTheme: Theme = {
  background: "bg-gradient-to-br from-slate-950 via-red-950 to-orange-950",
  cardBackground: "bg-gradient-to-br from-slate-800/70 to-red-800/20 backdrop-blur-xl",
  border: "border-orange-500/30",
  primary: "text-orange-400",
  primaryHover: "hover:text-orange-300",
  secondary: "text-red-400",
  accent: "text-amber-400",
  error: "text-red-500",
  success: "text-green-400",
  warning: "text-yellow-500",
  textPrimary: "text-white",
  textSecondary: "text-orange-200",
  textMuted: "text-slate-400",
  hoverBackground: "hover:bg-orange-800/30",
  selectBackground: "bg-orange-700/20 border-orange-400/50",
  gradient: "bg-gradient-to-r from-orange-500 to-red-600",
  cardGradient: "bg-gradient-to-br from-orange-500/10 to-red-600/10",
  shadow: "shadow-2xl shadow-orange-500/20",
  glassmorphism: "bg-white/5 backdrop-blur-md border-white/10"
};

interface NotificationsPageProps {
  theme: Theme;
  backPath: string;
}

const NotificationsPage = ({ theme, backPath }: NotificationsPageProps) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const socket = useSocket();
  const [notifications, setNotifications] = useState<INotificationView[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<INotificationView[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [basicDetails, setBasicDetails] = useState<{
    total: number;
    read: number;
  }>();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastNotificationRef = useCallback(
    (node: HTMLDivElement) => {
      if (loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreNotifications();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loadingMore, hasMore]
  );

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    if (user?._id && socket) {
      socket.on("connect", () => {
        console.log("Socket connected, ID:", socket.id);
        socket.emit(chatEnum.joinUser, {
          userId: user._id,
          role: user.role,
        });
        console.log("Emitted joinUser for user:", user._id, "role:", user.role);
      });

      socket.on(chatEnum.receiveNotification, (notification: INotificationView) => {
        console.log("Received notification:", notification);
        toast.success("New Notification: " + notification.text);
        setNotifications((prev) => [
          { ...notification, date: new Date(notification.date) },
          ...prev,
        ]);
        if (!notification.isRead) {
          setFilteredNotifications((prev) => [
            { ...notification, date: new Date(notification.date) },
            ...prev,
          ]);
        }
      });

      socket.on("adminNotification", (notification: INotificationView) => {
        console.log("Received admin notification:", notification);
        toast.success("New Admin Notification: " + notification.text);
        setNotifications((prev) => [
          { ...notification, date: new Date(notification.date) },
          ...prev,
        ]);
        if (!notification.isRead) {
          setFilteredNotifications((prev) => [
            { ...notification, date: new Date(notification.date) },
            ...prev,
          ]);
        }
      });

      return () => {
        socket.off("connect");
        socket.off(chatEnum.receiveNotification);
        socket.off("adminNotification");
      };
    }
  }, [socket, user]);

  useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500); // adjust delay as needed

  return () => {
    clearTimeout(handler);
  };
}, [searchTerm]);
  useEffect(() => {
    if (user?._id) {
      fetchInitialNotifications();
    }
  }, [user, debouncedSearchTerm, filterType, sortBy]);
  useEffect(() => {
    if (user?._id) {
      fetchBasicDetails();
    }
  }, []);

  const fetchBasicDetails = async () => {
    if (!user?._id) {
      console.warn("No user ID, skipping fetchBasicDetails");
      return;
    }
    setLoading(true);
    try {
      const response = await NotificationServices.getBasicDetails();
      setBasicDetails(response);
    } catch (error) {
      console.error("Failed to fetch Basic Details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInitialNotifications = async () => {
    if (!user?._id) {
      console.warn("No user ID, skipping fetchNotifications");
      return;
    }
    setLoading(true);
    try {
      console.log("Fetching notifications for user:", user._id);
      const response = await NotificationServices.getNotifications({
        userId: user._id,
        page: 1,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearchTerm,
        type: filterType === "all" ? undefined : filterType,
        sort: sortBy,
      });
      console.log('response in here',response);
      setNotifications(response.data.notifications);
      setFilteredNotifications(response.data.notifications);
      setPage(1);
      setHasMore( response.data.notifications.length < response.data.total );
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreNotifications = async () => {
    if (loadingMore || !hasMore || !user?._id) return;
    setLoadingMore(true);
    try {
      const response = await NotificationServices.getNotifications({
        userId: user._id,
        page: page + 1,
        limit: ITEMS_PER_PAGE,
        search: searchTerm,
        type: filterType === "all" ? undefined : filterType,
        sort: sortBy,
      });
      setNotifications((prev) => [...prev, ...response.data.notifications]);
      setFilteredNotifications((prev) => [...prev, ...response.data.notifications]);
      setPage((prev) => prev + 1);
      setHasMore( response.data.notifications.length + notifications.length < response.data.total );
    } catch (error) {
      console.error("Failed to load more notifications:", error);
      toast.error("Failed to load more notifications");
    } finally {
      setLoadingMore(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await NotificationServices.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
      );
      setFilteredNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
      );
      fetchBasicDetails();
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error(`Failed to mark as read : ${error} `);
    }
  };

  const markAllAsRead = async () => {
    if (!user?._id) return;
    try {
      await NotificationServices.markAllAsRead(user._id);
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
      setFilteredNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
      fetchBasicDetails();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error(`Failed to mark all as read: ${error}`);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await NotificationServices.deleteNotification(id);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      setFilteredNotifications((prev) => prev.filter((notif) => notif.id !== id));
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
      fetchBasicDetails();
      toast.success("Notification deleted");
    } catch (error) {
      toast.error(`Failed to delete notification: ${error}`);
    }
  };

  const deleteSelected = async () => {
    try {
      await NotificationServices.deleteSelected(selectedIds);
      setNotifications((prev) => prev.filter((notif) => !selectedIds.includes(notif.id)));
      setFilteredNotifications((prev) => prev.filter((notif) => !selectedIds.includes(notif.id)));
      setSelectedIds([]);
      fetchBasicDetails();
      toast.success(`${selectedIds.length} notifications deleted`);
    } catch (error) {
      toast.error(`Failed to delete selected notifications: ${error}`);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((notif) => notif.id));
    }
  };

  const getNotificationIcon = (category: string) => {
    const iconClass = "w-5 h-5 drop-shadow-lg";
    switch (category) {
      case "trainer_message":
      case "new_message":
      case "message":
        return <MessageCircle className={cn(iconClass, theme.primary)} />;
      case "session_reminder":
      case "session_booked":
      case "schedule":
        return <Calendar className={cn(iconClass, theme.success)} />;
      case "workout_update":
      case "payment_received":
      case "payment":
        return <DollarSign className={cn(iconClass, theme.accent)} />;
      case "diet_update":
      case "new_client":
      case "client":
        return <Users className={cn(iconClass, theme.secondary)} />;
      case "achievement":
      case "review":
      case "rating":
        return <Star className={cn(iconClass, theme.warning)} />;
      case "community_like":
      case "community_comment":
      case "system":
      case "update":
        return <Settings className={cn(iconClass, theme.textMuted)} />;
      case "welcome":
      case "approval":
        return <CheckCheck className={cn(iconClass, theme.success)} />;
      default:
        return <AlertCircle className={cn(iconClass, theme.error)} />;
    }
  };

  const formatTime = (date: Date | string) => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - parsedDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (isNaN(minutes)) return "Unknown time";
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  const getTypeDisplayName = (category: string) => {
    const typeMap: { [key: string]: string } = {
      trainer_message: "Trainer Messages",
      new_message: "Messages",
      message: "Messages",
      session_reminder: "Session Reminders",
      session_booked: "Session Bookings",
      schedule: "Schedule Updates",
      workout_update: "Workout Updates",
      diet_update: "Diet Updates",
      achievement: "Achievements",
      community_like: "Community Likes",
      community_comment: "Community Comments",
      payment_received: "Payments",
      payment: "Payments",
      new_client: "New Clients",
      client: "Client Updates",
      review: "Reviews",
      rating: "Ratings",
      welcome: "Welcome",
      system: "System",
      update: "Updates",
      approval: "Approvals",
    };
    return typeMap[category] || category;
  };

  const unreadCount = basicDetails ? basicDetails.total - basicDetails.read : filteredNotifications.filter((n) => !n.isRead).length;

  return (
    <div className={cn("min-h-screen p-4 sm:p-6 lg:p-8", theme.background)}>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite alternate;
        }
        @keyframes glow {
          from { box-shadow: 0 0 20px -10px currentColor; }
          to { box-shadow: 0 0 30px -5px currentColor; }
        }
        .gradient-text {
          background: linear-gradient(135deg, currentColor 0%, transparent 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(backPath)}
              className={cn(
                "group transition-all duration-300 transform hover:scale-105",
                theme.glassmorphism,
                theme.border,
                theme.textSecondary,
                theme.hoverBackground
              )}
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back
            </Button>
            
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={cn("animate-float", theme.primary)}>
                <Bell className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-2xl animate-glow" />
              </div>
              <div>
                <h1 className={cn(
                  "text-2xl sm:text-3xl lg:text-4xl font-bold mb-2",
                  theme.textPrimary,
                  "bg-gradient-to-r from-current to-transparent bg-clip-text text-transparent"
                )}>
                  All Notifications
                </h1>
                <p className={cn("text-sm sm:text-base", theme.textSecondary)}>
                  Manage all your notifications in one place
                </p>
              </div>
            </div>
            
            <div className="ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchInitialNotifications}
                disabled={loading}
                className={cn(
                  "group transition-all duration-300",
                  theme.glassmorphism,
                  theme.border,
                  theme.primary,
                  theme.primaryHover,
                  theme.hoverBackground
                )}
              >
                <RefreshCw
                  className={cn(
                    "w-4 h-4 mr-2 transition-transform group-hover:rotate-180",
                    loading ? "animate-spin" : ""
                  )}
                />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className={cn(
              "group transition-all duration-500 hover:scale-105",
              theme.cardBackground,
              theme.border,
              theme.shadow,
              "hover:shadow-2xl"
            )}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={cn("text-xs sm:text-sm font-medium mb-1", theme.textSecondary)}>
                      Total Notifications
                    </p>
                    <p className={cn(
                      "text-2xl sm:text-3xl font-bold",
                      theme.textPrimary,
                      "transition-all duration-300 group-hover:scale-110"
                    )}>
                      {basicDetails?.total || 0}
                    </p>
                  </div>
                  <div className={cn(
                    "p-3 rounded-full transition-all duration-300 group-hover:rotate-12",
                    theme.cardGradient
                  )}>
                    <Bell className={cn("w-6 h-6 sm:w-8 sm:h-8", theme.primary)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={cn(
              "group transition-all duration-500 hover:scale-105",
              theme.cardBackground,
              theme.border,
              theme.shadow,
              "hover:shadow-2xl"
            )}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={cn("text-xs sm:text-sm font-medium mb-1", theme.textSecondary)}>
                      Unread
                    </p>
                    <p className={cn(
                      "text-2xl sm:text-3xl font-bold",
                      theme.error,
                      "transition-all duration-300 group-hover:scale-110"
                    )}>
                      {unreadCount}
                    </p>
                  </div>
                  <div className={cn(
                    "p-3 rounded-full transition-all duration-300 group-hover:rotate-12",
                    "bg-gradient-to-br from-red-500/10 to-red-600/10"
                  )}>
                    <AlertCircle className={cn("w-6 h-6 sm:w-8 sm:h-8", theme.error)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={cn(
              "group transition-all duration-500 hover:scale-105 sm:col-span-2 lg:col-span-1",
              theme.cardBackground,
              theme.border,
              theme.shadow,
              "hover:shadow-2xl"
            )}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={cn("text-xs sm:text-sm font-medium mb-1", theme.textSecondary)}>
                      Read
                    </p>
                    <p className={cn(
                      "text-2xl sm:text-3xl font-bold",
                      theme.success,
                      "transition-all duration-300 group-hover:scale-110"
                    )}>
                      {basicDetails?.read || 0}
                    </p>
                  </div>
                  <div className={cn(
                    "p-3 rounded-full transition-all duration-300 group-hover:rotate-12",
                    "bg-gradient-to-br from-green-500/10 to-green-600/10"
                  )}>
                    <CheckCheck className={cn("w-6 h-6 sm:w-8 sm:h-8", theme.success)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls Card */}
          <Card className={cn(
            "transition-all duration-300",
            theme.cardBackground,
            theme.border,
            theme.shadow,
            "mb-6 sm:mb-8"
          )}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                {/* Search and Filters Row */}
                <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                  <div className="relative flex-1 max-w-md">
                    <Search className={cn(
                      "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4",
                      theme.textMuted
                    )} />
                    <Input
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={cn(
                        "pl-10 transition-all duration-300 focus:scale-105",
                        theme.glassmorphism,
                        theme.border,
                        theme.textPrimary,
                        `placeholder:${theme.textMuted}`
                      )}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className={cn(
                        "w-full sm:w-48 transition-all duration-300 hover:scale-105",
                        theme.glassmorphism,
                        theme.border,
                        theme.textPrimary
                      )}>
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent className={cn(theme.cardBackground, theme.border, "backdrop-blur-xl")}>
                        <SelectItem value="all" className={cn(theme.textPrimary, theme.hoverBackground)}>
                          All Types
                        </SelectItem>
                        <SelectItem value="unread" className={cn(theme.textPrimary, theme.hoverBackground)}>
                          Unread Only
                        </SelectItem>
                        <SelectItem value="read" className={cn(theme.textPrimary, theme.hoverBackground)}>
                          Read Only
                        </SelectItem>
                        <SelectItem value="trainer_message" className={cn(theme.textPrimary, theme.hoverBackground)}>
                          Trainer Messages
                        </SelectItem>
                        <SelectItem value="new_message" className={cn(theme.textPrimary, theme.hoverBackground)}>
                          Messages
                        </SelectItem>
                        <SelectItem value="session_reminder" className={cn(theme.textPrimary, theme.hoverBackground)}>
                          Session Reminders
                        </SelectItem>
                        <SelectItem value="session_booked" className={cn(theme.textPrimary, theme.hoverBackground)}>
                          Session Bookings
                        </SelectItem>
                        <SelectItem value="workout_update" className={cn(theme.textPrimary, theme.hoverBackground)}>
                          Workout Updates
                        </SelectItem>
                        <SelectItem value="diet_update" className={cn(theme.textPrimary, theme.hoverBackground)}>
                          Diet Updates
                        </SelectItem>
                        <SelectItem value="achievement" className={cn(theme.textPrimary, theme.hoverBackground)}>
                          Achievements
                        </SelectItem>
                        <SelectItem value="community_like" className={cn(theme.textPrimary, theme.hoverBackground)}>
                          Community Likes
                        </SelectItem>
                        <SelectItem value="community_comment" className={cn(theme.textPrimary, theme.hoverBackground)}>
                          Community Comments
                        </SelectItem>
                        <SelectItem value="payment_received" className={cn(theme.textPrimary, theme.hoverBackground)}>
                          Payments
                        </SelectItem>
                        <SelectItem value="welcome" className={cn(theme.textPrimary, theme.hoverBackground)}>
                          Welcome
                        </SelectItem>
                        <SelectItem value="approval" className={cn(theme.textPrimary, theme.hoverBackground)}>
                          Approvals
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className={cn(
                        "w-full sm:w-40 transition-all duration-300 hover:scale-105",
                        theme.glassmorphism,
                        theme.border,
                        theme.textPrimary
                      )}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={cn(theme.cardBackground, theme.border, "backdrop-blur-xl")}>
                        <SelectItem value="newest" className={cn(theme.textPrimary, theme.hoverBackground)}>
                          Newest First
                        </SelectItem>
                        <SelectItem value="oldest" className={cn(theme.textPrimary, theme.hoverBackground)}>
                          Oldest First
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    disabled={loading || filteredNotifications.length === 0}
                    className={cn(
                      "group transition-all duration-300 hover:scale-105",
                      theme.glassmorphism,
                      theme.border,
                      theme.success,
                      theme.hoverBackground
                    )}
                  >
                    <CheckCheck className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" />
                    Mark All Read
                  </Button>
                  
                  {selectedIds.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={deleteSelected}
                      className={cn(
                        "group transition-all duration-300 hover:scale-105",
                        theme.glassmorphism,
                        theme.border,
                        theme.error,
                        "hover:bg-red-900/30"
                      )}
                    >
                      <Trash2 className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" />
                      Delete Selected ({selectedIds.length})
                    </Button>
                  )}
                  
                  {filteredNotifications.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleSelectAll}
                      className={cn(
                        "group transition-all duration-300 hover:scale-105",
                        theme.glassmorphism,
                        theme.border,
                        theme.secondary,
                        theme.hoverBackground
                      )}
                    >
                      {selectedIds.length === filteredNotifications.length
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <Card className={cn(
          "transition-all duration-300",
          theme.cardBackground,
          theme.border,
          theme.shadow
        )}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className={cn(
                "flex items-center gap-3",
                theme.textPrimary,
                "text-xl sm:text-2xl font-bold"
              )}>
                <Filter className="w-6 h-6" />
                <span className="gradient-text">
                  {filteredNotifications.length} Notification
                  {filteredNotifications.length !== 1 ? "s" : ""}
                </span>
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-0 no-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <div className={cn(
                    "w-16 h-16 rounded-full animate-spin",
                    "border-4 border-transparent",
                    theme.gradient,
                    "border-t-transparent"
                  )}></div>
                  <Bell className={cn(
                    "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                    "w-6 h-6",
                    theme.primary
                  )} />
                </div>
                <span className={cn("mt-4 text-lg font-medium", theme.textSecondary)}>
                  Loading notifications...
                </span>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className={cn(
                  "relative p-8 rounded-full mb-6",
                  theme.cardGradient,
                  "animate-float"
                )}>
                  <Bell className={cn("w-16 h-16 opacity-50", theme.textMuted)} />
                </div>
                <h3 className={cn("text-xl sm:text-2xl font-bold mb-3", theme.textPrimary)}>
                  No notifications found
                </h3>
                <p className={cn("text-sm sm:text-base text-center max-w-md", theme.textSecondary)}>
                  {searchTerm || filterType !== "all"
                    ? "Try adjusting your search or filter criteria to find what you're looking for"
                    : "You're all caught up! No new notifications to show at the moment"}
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {filteredNotifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    ref={
                      index === filteredNotifications.length - 1
                        ? lastNotificationRef
                        : null
                    }
                    className={cn(
                      "group flex items-start gap-4 sm:gap-6 p-4 sm:p-6",
                      "border-b transition-all duration-300",
                      theme.border,
                      theme.hoverBackground,
                      "hover:scale-[1.02] hover:shadow-lg",
                      !notification.isRead && `border-l-4 ${theme.cardGradient}`,
                      selectedIds.includes(notification.id) && theme.selectBackground
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(notification.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds((prev) => [...prev, notification.id]);
                        } else {
                          setSelectedIds((prev) =>
                            prev.filter((id) => id !== notification.id)
                          );
                        }
                      }}
                      className={cn(
                        "mt-1 w-5 h-5 rounded transition-all duration-300",
                        "focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent",
                        theme.primary
                      )}
                    />

                    <div className="mt-1 transform transition-transform duration-300 group-hover:scale-110">
                      {getNotificationIcon(notification.category)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className={cn(
                            "text-sm sm:text-base leading-relaxed mb-3",
                            "transition-all duration-300",
                            !notification.isRead
                              ? `font-semibold ${theme.textPrimary}`
                              : theme.textSecondary
                          )}>
                            {notification.text}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            <span className={cn("text-xs sm:text-sm", theme.textMuted)}>
                              {formatTime(notification.date)}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs px-2 py-1 transition-all duration-300",
                                theme.glassmorphism,
                                theme.border,
                                theme.textSecondary,
                                "hover:scale-105"
                              )}
                            >
                              {getTypeDisplayName(notification.category)}
                            </Badge>
                            {!notification.isRead && (
                              <Badge className={cn(
                                "text-xs px-2 py-1 animate-glow",
                                theme.gradient,
                                "text-white font-medium"
                              )}>
                                New
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className={cn(
                                "h-9 w-9 p-0 group transition-all duration-300",
                                "hover:scale-110 hover:rotate-12",
                                theme.glassmorphism,
                                theme.success,
                                theme.hoverBackground
                              )}
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4 transition-transform group-hover:scale-125" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className={cn(
                              "h-9 w-9 p-0 group transition-all duration-300",
                              "hover:scale-110 hover:rotate-12",
                              theme.glassmorphism,
                              theme.error,
                              "hover:bg-red-900/30"
                            )}
                            title="Delete notification"
                          >
                            <X className="w-4 h-4 transition-transform group-hover:scale-125" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {loadingMore && (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-3">
                      <Loader2 className={cn("w-6 h-6 animate-spin", theme.primary)} />
                      <span className={cn("text-sm sm:text-base font-medium", theme.textSecondary)}>
                        Loading more notifications...
                      </span>
                    </div>
                  </div>
                )}

                {!hasMore && notifications.length > 0 && (
                  <div className={cn(
                    "flex flex-col items-center justify-center py-8",
                    theme.textMuted
                  )}>
                    <div className={cn(
                      "w-12 h-1 rounded-full mb-4",
                      theme.gradient,
                      "opacity-50"
                    )}></div>
                    <span className="text-sm font-medium">
                      {/* eslint-disable-next-line */}
                      You've reached the end of your notifications
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;