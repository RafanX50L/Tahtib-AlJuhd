import { useState, useEffect } from "react";
import api from "@/services/implementation/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Check,
  X,
  MessageCircle,
  Calendar,
  AlertCircle,
  Settings,
  DollarSign,
  Users,
  Star,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSocket } from "@/hooks/socketio";
import { chatEnum } from "@/lib/chat-enum"; 
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { INotification } from "../client/CNotificationDropDown";



function TrainerNotificationDropdown() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const socket = useSocket();
  const { user, notifications: storeNotifications } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?._id) {
        console.warn("No user ID, skipping fetchNotifications");
        return;
      }
      try {
        console.log("Fetching notifications for trainer:", user._id);
        const fetchedNotifications = storeNotifications.map((n: INotification) => ({
          ...n,
          createdAt: new Date(n.date),
        }));
        setNotifications(fetchedNotifications);
        setUnreadCount(fetchedNotifications.filter((n: INotification) => !n.isRead).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to fetch notifications");
      }
    };

    if (user?._id) {
      fetchNotifications();
    }

    if (socket && user?._id) {
      console.log("Setting up socket listeners for trainer:", user._id);
      socket.on(chatEnum.receiveNotification, (notification: INotification) => {
        console.log("Trainer received notification:", notification);
        toast.success("New Notification: " + notification.text);
        setNotifications((prev) => [
          { ...notification, createdAt: new Date(notification.date) },
          ...prev,
        ]);
        
        if (!notification.isRead) {
          setUnreadCount((prev) => prev + 1);
        }
      });

      socket.on("trainerNotification", (notification: INotification) => {
        console.log("Trainer received trainer-specific notification:", notification);
        toast.success("New Trainer Notification: " + notification.text);
        setNotifications((prev) => [
          { ...notification, createdAt: new Date(notification.date) },
          ...prev,
        ]);
        if (!notification.isRead) {
          setUnreadCount((prev) => prev + 1);
        }
      });

      socket.emit(chatEnum.joinUser, {
        userId: user._id,
        role: user.role,
      });
    }

    return () => {
      socket?.off(chatEnum.receiveNotification);
      socket?.off("trainerNotification");
    };
  }, [socket, user]);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/api/notifications/mark-all-read");
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      const deletedNotif = notifications.find((n) => n.id === id);
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_message":
      case "message":
        return <MessageCircle className="w-4 h-4 text-[#6366f1]" />;
      case "session_reminder":
      case "session_booked":
      case "schedule":
        return <Calendar className="w-4 h-4 text-[#10b981]" />;
      case "payment":
      case "payment_received":
        return <DollarSign className="w-4 h-4 text-[#f59e0b]" />;
      case "new_client":
      case "client":
        return <Users className="w-4 h-4 text-[#6366f1]" />;
      case "review":
      case "rating":
        return <Star className="w-4 h-4 text-[#f59e0b]" />;
      case "system":
      case "update":
        return <Settings className="w-4 h-4 text-[#b0b0b0]" />;
      case "approval":
        return <Check className="w-4 h-4 text-[#10b981]" />;
      default:
        return <AlertCircle className="w-4 h-4 text-[#ef4444]" />;
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
    return `${days}d ago`;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative bg-[#1e1e1e] border border-[#2c2c2c] rounded-lg text-[#b0b0b0] hover:bg-[#6366f1]/10 hover:text-[#6366f1] hover:border-[#6366f1] transition-all"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-[#6366f1] to-[#818cf8] text-white px-1.5 py-0 text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-[#121212]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80 bg-[#1e1e1e] border-[#2c2c2c] shadow-2xl"
        align="end"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#2c2c2c]">
          <DropdownMenuLabel className="text-[#ffffff] font-semibold text-lg">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-[#6366f1] hover:text-[#818cf8] hover:bg-[#6366f1]/10 text-xs h-8"
            >
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="max-h-96">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#b0b0b0]">
              <Bell className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">No notifications yet</p>
              <p className="text-xs opacity-70">
                We'll notify you when something important happens
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className={`flex flex-col items-start gap-2 p-4 border-b border-[#2c2c2c] hover:bg-[#6366f1]/10 cursor-default ${
                  !notif.isRead ? "bg-[#121212] border-l-4 border-l-[#6366f1]" : ""
                }`}
                onClick={(e) => e.preventDefault()}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getNotificationIcon(notif.category)}</div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-relaxed ${
                          !notif.isRead ? "text-[#ffffff] font-medium" : "text-[#b0b0b0]"
                        }`}
                      >
                        {notif.text}
                      </p>
                      <span className="text-xs text-[#6b7280] mt-1 block">
                        {formatTime(notif.date)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    {!notif.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif.id);
                        }}
                        className="h-6 w-6 p-0 text-[#6366f1] hover:text-[#818cf8] hover:bg-[#6366f1]/10"
                        title="Mark as read"
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="h-6 w-6 p-0 text-[#ef4444] hover:text-[#f87171] hover:bg-[#ef4444]/10"
                      title="Delete notification"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>

        <DropdownMenuSeparator className="bg-[#2c2c2c]" />
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full text-[#6366f1] hover:text-[#818cf8] hover:bg-[#6366f1]/10 justify-center"
            onClick={() => {
              setIsOpen(false);
              navigate('/trainer/notification')
              // Navigate to notifications page if you have one
            }}
          >
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TrainerNotificationDropdown;