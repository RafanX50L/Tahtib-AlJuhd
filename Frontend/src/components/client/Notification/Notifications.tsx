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

export interface INotificationView {
  id: string;
  sender: string;
  receiver?: string;
  role?: string;
  text: string;
  category: string;
  date: Date | string;
  isRead: boolean;
}

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const socket = useSocket();
  const [notifications, setNotifications] = useState<INotificationView[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    INotificationView[]
  >([]);
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
  } >();

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

      socket.on(
        chatEnum.receiveNotification,
        (notification: INotificationView) => {
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
        }
      );

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
    if (user?._id) {
      fetchInitialNotifications();
      fetchBasicDetails();
    }
  }, [user, searchTerm, filterType, sortBy]);

  const fetchBasicDetails = async () => {
    if (!user?._id) {
      console.warn("No user ID, skipping fetchNotifications");
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
        search: searchTerm,
        type: filterType === "all" ? undefined : filterType,
        sort: sortBy,
      });
      setNotifications(response.data.notifications);
      setFilteredNotifications(response.data.notifications);
      setPage(1);
      setHasMore(
        basicDetails?.total as number > response.data.notifications.length
      );
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
      setFilteredNotifications((prev) => [
        ...prev,
        ...response.data.notifications,
      ]);
      setPage((prev) => prev + 1);
      setHasMore(
        basicDetails?.total as number >
          notifications.length + response.data.notifications.length
      );
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
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
      setFilteredNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
      fetchBasicDetails();
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    if (!user?._id) return;
    try {
      await NotificationServices.markAllAsRead(user._id);
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      setFilteredNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      fetchBasicDetails();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await NotificationServices.deleteNotification(id);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      setFilteredNotifications((prev) =>
        prev.filter((notif) => notif.id !== id)
      );
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
      fetchBasicDetails();
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const deleteSelected = async () => {
    try {
      await NotificationServices.deleteSelected(selectedIds);
      setNotifications((prev) =>
        prev.filter((notif) => !selectedIds.includes(notif.id))
      );
      setFilteredNotifications((prev) =>
        prev.filter((notif) => !selectedIds.includes(notif.id))
      );
      setSelectedIds([]);
      toast.success(`${selectedIds.length} notifications deleted`);
    } catch (error) {
      toast.error("Failed to delete selected notifications");
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
    switch (category) {
      case "trainer_message":
      case "new_message":
      case "message":
        return <MessageCircle className="w-5 h-5 text-[#5D5FEF]" />;
      case "session_reminder":
      case "session_booked":
      case "schedule":
        return <Calendar className="w-5 h-5 text-[#FF4757]" />;
      case "workout_update":
      case "payment_received":
      case "payment":
        return <DollarSign className="w-5 h-5 text-[#FFA726]" />;
      case "diet_update":
      case "new_client":
      case "client":
        return <Users className="w-5 h-5 text-[#5D5FEF]" />;
      case "achievement":
      case "review":
      case "rating":
        return <Star className="w-5 h-5 text-[#4CAF50]" />;
      case "community_like":
      case "community_comment":
      case "system":
      case "update":
        return <Settings className="w-5 h-5 text-[#26D0CE]" />;
      case "welcome":
      case "approval":
        return <CheckCheck className="w-5 h-5 text-[#4CAF50]" />;
      default:
        return <AlertCircle className="w-5 h-5 text-[#FFA726]" />;
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#12151E] via-[#1E2235] to-[#12151E] p-4 lg:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-[#A0A7B8] hover:text-white hover:bg-[#2A3042]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-[#5D5FEF]" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-[#A0A7B8] bg-clip-text text-transparent">
                All Notifications
              </h1>
              <p className="text-[#A0A7B8] text-sm">
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
              className="text-[#5D5FEF] hover:text-[#7577F5] hover:bg-[#2A3042]"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-[#1E2235] to-[#2A3042] border-[#2A3042]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#A0A7B8] text-sm">Total Notifications</p>
                  <p className="text-2xl font-bold text-white">{basicDetails?.total}</p>
                </div>
                <Bell className="w-8 h-8 text-[#5D5FEF]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-[#1E2235] to-[#2A3042] border-[#2A3042]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#A0A7B8] text-sm">Unread</p>
                  <p className="text-2xl font-bold text-[#FF4757]">
                    {basicDetails && (basicDetails?.total - basicDetails?.read )}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-[#FF4757]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-[#1E2235] to-[#2A3042] border-[#2A3042]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#A0A7B8] text-sm">Read</p>
                  <p className="text-2xl font-bold text-[#4CAF50]">
                    {basicDetails && (basicDetails.read)}
                  </p>
                </div>
                <CheckCheck className="w-8 h-8 text-[#4CAF50]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="bg-gradient-to-r from-[#1E2235] to-[#2A3042] border-[#2A3042] mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A0A7B8]" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#12151E] border-[#2A3042] text-white placeholder:text-[#A0A7B8]"
                />
              </div>

              {/* Type Filter */}
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48 bg-[#12151E] border-[#2A3042] text-white">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-[#1E2235] border-[#2A3042]">
                  <SelectItem
                    value="all"
                    className="text-white hover:bg-[#2A3042]"
                  >
                    All Types
                  </SelectItem>
                  <SelectItem
                    value="unread"
                    className="text-white hover:bg-[#2A3042]"
                  >
                    Unread Only
                  </SelectItem>
                  <SelectItem
                    value="read"
                    className="text-white hover:bg-[#2A3042]"
                  >
                    Read Only
                  </SelectItem>
                  <SelectItem
                    value="trainer_message"
                    className="text-white hover:bg-[#2A3042]"
                  >
                    Trainer Messages
                  </SelectItem>
                  <SelectItem
                    value="new_message"
                    className="text-white hover:bg-[#2A3042]"
                  >
                    Messages
                  </SelectItem>
                  <SelectItem
                    value="session_reminder"
                    className="text-white hover:bg-[#2A3042]"
                  >
                    Session Reminders
                  </SelectItem>
                  <SelectItem
                    value="session_booked"
                    className="text-white hover:bg-[#2A3042]"
                  >
                    Session Bookings
                  </SelectItem>
                  <SelectItem
                    value="workout_update"
                    className="text-white hover:bg-[#2A3042]"
                  >
                    Workout Updates
                  </SelectItem>
                  <SelectItem
                    value="diet_update"
                    className="text-white hover:bg-[#2A3042]"
                  >
                    Diet Updates
                  </SelectItem>
                  <SelectItem
                    value="achievement"
                    className="text-white hover:bg-[#2A3042]"
                  >
                    Achievements
                  </SelectItem>
                  <SelectItem
                    value="community_like"
                    className="text-white hover:bg-[#2A3042]"
                  >
                    Community Likes
                  </SelectItem>
                  <SelectItem
                    value="community_comment"
                    className="text-white hover:bg-[#2A3042]"
                  >
                    Community Comments
                  </SelectItem>
                  <SelectItem
                    value="payment_received"
                    className="text-white hover:bg-[#2A3042]"
                  >
                    Payments
                  </SelectItem>
                  <SelectItem
                    value="welcome"
                    className="text-white hover:bg-[#2A3042]"
                  >
                    Welcome
                  </SelectItem>
                  <SelectItem
                    value="approval"
                    className="text-white hover:bg-[#2A3042]"
                  >
                    Approvals
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-[#12151E] border-[#2A3042] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1E2235] border-[#2A3042]">
                  <SelectItem
                    value="newest"
                    className="text-white hover:bg-[#2A3042]"
                  >
                    Newest First
                  </SelectItem>
                  <SelectItem
                    value="oldest"
                    className="text-white hover:bg-[#2A3042]"
                  >
                    Oldest First
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Bulk Actions */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-[#5D5FEF] hover:text-[#7577F5] hover:bg-[#2A3042]"
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
                {selectedIds.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={deleteSelected}
                    className="text-[#FF4757] hover:text-[#FF6B7A] hover:bg-[#2A3042]"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected ({selectedIds.length})
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card className="bg-gradient-to-r from-[#1E2235] to-[#2A3042] border-[#2A3042]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              {filteredNotifications.length} Notification
              {filteredNotifications.length !== 1 ? "s" : ""}
            </CardTitle>
            {filteredNotifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSelectAll}
                className="text-[#A0A7B8] hover:text-white hover:bg-[#2A3042]"
              >
                {selectedIds.length === filteredNotifications.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-[#5D5FEF] animate-spin" />
              <span className="ml-2 text-[#A0A7B8]">
                Loading notifications...
              </span>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#A0A7B8]">
              <Bell className="w-16 h-16 mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">
                No notifications found
              </h3>
              <p className="text-sm opacity-70">
                {searchTerm || filterType !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You're all caught up! No notifications to show"}
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
                  className={`flex items-start gap-4 p-6 border-b border-[#2A3042] hover:bg-[#2A3042] transition-colors ${
                    !notification.isRead
                      ? "bg-[#1E2235] border-l-4 border-l-[#5D5FEF]"
                      : ""
                  } ${
                    selectedIds.includes(notification.id) ? "bg-[#2A3042]" : ""
                  }`}
                >
                  {/* Checkbox */}
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
                    className="mt-1 w-4 h-4 text-[#5D5FEF] bg-[#12151E] border-[#2A3042] rounded focus:ring-[#5D5FEF]"
                  />

                  {/* Icon */}
                  <div className="mt-1">
                    {getNotificationIcon(notification.category)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p
                          className={`text-sm leading-relaxed mb-2 ${
                            !notification.isRead
                              ? "text-white font-medium"
                              : "text-[#A0A7B8]"
                          }`}
                        >
                          {notification.text}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                          <span>{formatTime(notification.date)}</span>
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-0.5 border-[#2A3042] text-[#A0A7B8]"
                          >
                            {getTypeDisplayName(notification.category)}
                          </Badge>
                          {!notification.isRead && (
                            <Badge className="text-xs px-2 py-0.5 bg-[#5D5FEF] text-white">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 w-8 p-0 text-[#5D5FEF] hover:text-[#7577F5] hover:bg-[#2A3042]"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-8 w-8 p-0 text-[#FF4757] hover:text-[#FF6B7A] hover:bg-[#2A3042]"
                          title="Delete notification"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading more indicator */}
              {loadingMore && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-6 h-6 text-[#5D5FEF] animate-spin" />
                  <span className="ml-2 text-[#A0A7B8]">
                    Loading more notifications...
                  </span>
                </div>
              )}

              {/* End of data indicator */}
              {!hasMore && notifications.length > 0 && (
                <div className="flex items-center justify-center py-6 text-[#A0A7B8]">
                  <span className="text-sm">
                    You've reached the end of your notifications
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
