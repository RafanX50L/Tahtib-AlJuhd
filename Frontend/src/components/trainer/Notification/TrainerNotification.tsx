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

const TrainerNotificationsPage = () => {
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

  const ITEMS_PER_PAGE = 10;

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
    if (user?._id) {
      fetchInitialNotifications();
    }
  }, [user, searchTerm, filterType, sortBy]);

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
      setNotifications(response.data);
      setFilteredNotifications(response.data);
      setPage(1);
      setHasMore(response.data.length === ITEMS_PER_PAGE);
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
      setNotifications((prev) => [...prev, ...response.data]);
      setFilteredNotifications((prev) => [...prev, ...response.data]);
      setPage((prev) => prev + 1);
      setHasMore(response.data.length === ITEMS_PER_PAGE);
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
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    if (!user?._id) return;
    try {
      await NotificationServices.markAllAsRead(user._id);
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
      setFilteredNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await NotificationServices.deleteNotification(id);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      setFilteredNotifications((prev) => prev.filter((notif) => notif.id !== id));
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const deleteSelected = async () => {
    try {
      await NotificationServices.deleteSelected(selectedIds);
      setNotifications((prev) => prev.filter((notif) => !selectedIds.includes(notif.id)));
      setFilteredNotifications((prev) => prev.filter((notif) => !selectedIds.includes(notif.id)));
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
      case "new_message":
      case "message":
        return <MessageCircle className="w-5 h-5 text-[#6366f1]" />;
      case "session_booked":
      case "session_reminder":
      case "schedule":
        return <Calendar className="w-5 h-5 text-[#10b981]" />;
      case "payment_received":
      case "payment":
        return <DollarSign className="w-5 h-5 text-[#f59e0b]" />;
      case "new_client":
      case "client":
        return <Users className="w-5 h-5 text-[#6366f1]" />;
      case "review":
      case "rating":
        return <Star className="w-5 h-5 text-[#f59e0b]" />;
      case "system":
      case "update":
        return <Settings className="w-5 h-5 text-[#b0b0b0]" />;
      case "approval":
        return <Check className="w-5 h-5 text-[#10b981]" />;
      default:
        return <AlertCircle className="w-5 h-5 text-[#ef4444]" />;
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
      new_message: "Messages",
      message: "Messages",
      session_booked: "Session Bookings",
      session_reminder: "Session Reminders",
      schedule: "Schedule Updates",
      payment_received: "Payments",
      payment: "Payments",
      new_client: "New Clients",
      client: "Client Updates",
      review: "Reviews",
      rating: "Ratings",
      system: "System",
      update: "Updates",
      approval: "Approvals",
    };
    return typeMap[category] || category;
  };

  const unreadCount = filteredNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#121212] text-[#ffffff] p-4 lg:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-[#b0b0b0] hover:text-[#ffffff] hover:bg-[#1e1e1e]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-[#6366f1]" />
            <div>
              <h1 className="text-3xl font-bold text-[#6366f1]">
                All Notifications
              </h1>
              <p className="text-[#b0b0b0] text-sm">
                Manage all your trainer notifications in one place
              </p>
            </div>
          </div>
          <div className="ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchInitialNotifications}
              disabled={loading}
              className="text-[#6366f1] hover:text-[#818cf8] hover:bg-[#1e1e1e]"
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
          <Card className="bg-[#1e1e1e] border-[#2c2c2c]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#b0b0b0] text-sm">Total Notifications</p>
                  <p className="text-2xl font-bold text-[#ffffff]">
                    {notifications.length}
                  </p>
                </div>
                <Bell className="w-8 h-8 text-[#6366f1]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e1e1e] border-[#2c2c2c]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#b0b0b0] text-sm">Unread</p>
                  <p className="text-2xl font-bold text-[#ef4444]">
                    {unreadCount}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-[#ef4444]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e1e1e] border-[#2c2c2c]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#b0b0b0] text-sm">Read</p>
                  <p className="text-2xl font-bold text-[#10b981]">
                    {notifications.length - unreadCount}
                  </p>
                </div>
                <CheckCheck className="w-8 h-8 text-[#10b981]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="bg-[#1e1e1e] border-[#2c2c2c] mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#b0b0b0]" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#121212] border-[#2c2c2c] text-[#ffffff] placeholder:text-[#b0b0b0]"
                />
              </div>

              {/* Type Filter */}
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48 bg-[#121212] border-[#2c2c2c] text-[#ffffff]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e1e1e] border-[#2c2c2c]">
                  <SelectItem
                    value="all"
                    className="text-[#ffffff] hover:bg-[#2c2c2c]"
                  >
                    All Types
                  </SelectItem>
                  <SelectItem
                    value="unread"
                    className="text-[#ffffff] hover:bg-[#2c2c2c]"
                  >
                    Unread Only
                  </SelectItem>
                  <SelectItem
                    value="read"
                    className="text-[#ffffff] hover:bg-[#2c2c2c]"
                  >
                    Read Only
                  </SelectItem>
                  <SelectItem
                    value="new_message"
                    className="text-[#ffffff] hover:bg-[#2c2c2c]"
                  >
                    Messages
                  </SelectItem>
                  <SelectItem
                    value="session_booked"
                    className="text-[#ffffff] hover:bg-[#2c2c2c]"
                  >
                    Session Bookings
                  </SelectItem>
                  <SelectItem
                    value="payment_received"
                    className="text-[#ffffff] hover:bg-[#2c2c2c]"
                  >
                    Payments
                  </SelectItem>
                  <SelectItem
                    value="review"
                    className="text-[#ffffff] hover:bg-[#2c2c2c]"
                  >
                    Reviews
                  </SelectItem>
                  <SelectItem
                    value="approval"
                    className="text-[#ffffff] hover:bg-[#2c2c2c]"
                  >
                    Approvals
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-[#121212] border-[#2c2c2c] text-[#ffffff]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1e1e1e] border-[#2c2c2c]">
                  <SelectItem
                    value="newest"
                    className="text-[#ffffff] hover:bg-[#2c2c2c]"
                  >
                    Newest First
                  </SelectItem>
                  <SelectItem
                    value="oldest"
                    className="text-[#ffffff] hover:bg-[#2c2c2c]"
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
                  className="text-[#6366f1] hover:text-[#818cf8] hover:bg-[#1e1e1e]"
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
                {selectedIds.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={deleteSelected}
                    className="text-[#ef4444] hover:text-[#f87171] hover:bg-[#1e1e1e]"
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
      <Card className="bg-[#1e1e1e] border-[#2c2c2c]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#ffffff] flex items-center gap-2">
              <Filter className="w-5 h-5" />
              {filteredNotifications.length} Notification
              {filteredNotifications.length !== 1 ? "s" : ""}
            </CardTitle>
            {filteredNotifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSelectAll}
                className="text-[#b0b0b0] hover:text-[#ffffff] hover:bg-[#2c2c2c]"
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
              <RefreshCw className="w-8 h-8 text-[#6366f1] animate-spin" />
              <span className="ml-2 text-[#b0b0b0]">Loading notifications...</span>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#b0b0b0]">
              <Bell className="w-16 h-16 mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">No notifications found</h3>
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
                  className={`flex items-start gap-4 p-6 border-b border-[#2c2c2c] hover:bg-[#121212] transition-colors ${
                    !notification.isRead
                      ? "bg-[#1e1e1e] border-l-4 border-l-[#6366f1]"
                      : ""
                  } ${
                    selectedIds.includes(notification.id) ? "bg-[#2c2c2c]" : ""
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
                    className="mt-1 w-4 h-4 text-[#6366f1] bg-[#121212] border-[#2c2c2c] rounded focus:ring-[#6366f1]"
                  />

                  {/* Icon */}
                  <div className="mt-1">{getNotificationIcon(notification.category)}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p
                          className={`text-sm leading-relaxed mb-2 ${
                            !notification.isRead
                              ? "text-[#ffffff] font-medium"
                              : "text-[#b0b0b0]"
                          }`}
                        >
                          {notification.text}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-[#6b7280]">
                          <span>{formatTime(notification.date)}</span>
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-0.5 border-[#2c2c2c] text-[#b0b0b0]"
                          >
                            {getTypeDisplayName(notification.category)}
                          </Badge>
                          {!notification.isRead && (
                            <Badge className="text-xs px-2 py-0.5 bg-[#6366f1] text-white">
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
                            className="h-8 w-8 p-0 text-[#6366f1] hover:text-[#818cf8] hover:bg-[#2c2c2c]"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-8 w-8 p-0 text-[#ef4444] hover:text-[#f87171] hover:bg-[#2c2c2c]"
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
                  <Loader2 className="w-6 h-6 text-[#6366f1] animate-spin" />
                  <span className="ml-2 text-[#b0b0b0]">
                    Loading more notifications...
                  </span>
                </div>
              )}

              {/* End of data indicator */}
              {!hasMore && notifications.length > 0 && (
                <div className="flex items-center justify-center py-6 text-[#b0b0b0]">
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

export default TrainerNotificationsPage;