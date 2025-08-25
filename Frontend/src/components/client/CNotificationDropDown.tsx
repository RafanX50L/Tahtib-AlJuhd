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
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSocket } from "@/hooks/socketio";
import { chatEnum } from "@/lib/chat-enum"; 
import { toast } from "sonner";
import { ClientService } from "@/services/implementation/clientServices";
import { NotificationServices } from "@/services/implementation/NotificationServices";
import { useNavigate } from "react-router-dom";

export interface INotification {
  id: string;            // unique identifier
  sender: string;        // who sent it
  receiver?: string;     // who receives it (optional for role-based)
  role?: string;         // role of receiver (user, admin, trainer)
  text: string;          // notification message
  category: string;      // notification category/type
  date: Date;            // ISO date string for createdAt
  isRead: boolean;       // read/unread status
}


function CNotificationDropdown() {
  const [notificationse, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const socket = useSocket();
  const { user, notifications  } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?._id) {
        console.warn("No user ID, skipping fetchNotifications");
        return;
      }
      try {
        console.log("Fetching notifications for user:", user._id);
        // const response = await ClientService.getNotification(user._id);
        console.log('fetched Response',notifications);
        const fetchedNotifications = notifications.map((n: INotification) => ({
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
      console.log("Setting up socket listeners for user:", user._id);
      socket.on(chatEnum.receiveNotification, (notification: INotification) => {
        console.log("Frontend received notification:", notification);
        toast.success("New Notification: " + notification.text);
        setNotifications((prev) => [
          { ...notification, createdAt: new Date(notification.date) },
          ...prev,
        ]);
        if (!notification.isRead) {
          setUnreadCount((prev) => prev + 1);
        }
      });

      socket.on("adminNotification", (notification: INotification) => {
        console.log("Frontend received admin notification:", notification);
        toast.success("New Admin Notification: " + notification.text);
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
      socket?.off("adminNotification");
    };
  }, [socket, user]);

  const markAsRead = async (id: string) => {
    try {
      await NotificationServices.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await NotificationServices.markAllAsRead(user?._id as string);
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await NotificationServices.deleteNotification(id);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      const deletedNotif = notificationse.find((n) => n.id === id);
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
        return <MessageCircle className="w-4 h-4 text-[#5D5FEF]" />;
      case "session_reminder":
        return <Calendar className="w-4 h-4 text-[#FF4757]" />;
      case "workout_update":
        return <Settings className="w-4 h-4 text-[#26D0CE]" />;
      case "approval":
        return <Check className="w-4 h-4 text-[#26D0CE]" />;
      default:
        return <AlertCircle className="w-4 h-4 text-[#FFA726]" />;
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
          className="relative bg-[#1E2235] border border-[#2A3042] rounded-lg text-[#A0A7B8] hover:bg-[#2A3042] hover:text-white hover:border-[#5D5FEF] transition-all"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-[#5D5FEF] to-[#7577F5] text-white px-1.5 py-0 text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-[#12151E]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80 bg-gradient-to-b from-[#12151E] to-[#1E2235] border-[#2A3042] shadow-2xl"
        align="end"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#2A3042]">
          <DropdownMenuLabel className="text-white font-semibold text-lg">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-[#5D5FEF] hover:text-[#7577F5] hover:bg-[#2A3042] text-xs h-8"
            >
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="max-h-96">
          {notificationse.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#A0A7B8]">
              <Bell className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">No notifications yet</p>
              <p className="text-xs opacity-70">
                We'll notify you when something important happens
              </p>
            </div>
          ) : (
            notificationse.map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className={`flex flex-col items-start gap-2 p-4 border-b border-[#2A3042] hover:bg-[#2A3042] cursor-default ${
                  !notif.isRead ? "bg-[#1E2235] border-l-4 border-l-[#5D5FEF]" : ""
                }`}
                onClick={(e) => e.preventDefault()}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getNotificationIcon(notif.category)}</div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-relaxed ${
                          !notif.isRead ? "text-white font-medium" : "text-[#A0A7B8]"
                        }`}
                      >
                        {notif.text}
                      </p>
                      <span className="text-xs text-[#6B7280] mt-1 block">
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
                        className="h-6 w-6 p-0 text-[#5D5FEF] hover:text-[#7577F5] hover:bg-[#2A3042]"
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
                      className="h-6 w-6 p-0 text-[#FF4757] hover:text-[#FF6B7A] hover:bg-[#2A3042]"
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

        <DropdownMenuSeparator className="bg-[#2A3042]" />
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full text-[#5D5FEF] hover:text-[#7577F5] hover:bg-[#2A3042] justify-center"
            onClick={() => {
              setIsOpen(false);
              navigate("/notifications")            }}
          >
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CNotificationDropdown;