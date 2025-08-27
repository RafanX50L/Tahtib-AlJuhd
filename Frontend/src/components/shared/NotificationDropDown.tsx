import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store/store";
import { useSocket } from "@/hooks/socketio";
import { chatEnum } from "@/lib/chat-enum";
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
  CheckCheck,
  Star,
  DollarSign,
  Users,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { NotificationServices } from "@/services/implementation/NotificationServices";
import { cn } from "@/lib/utils";
import { INotificationView } from "./Notification";

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

interface NotificationDropdownProps {
  theme: Theme;
  navPath: string;
}

const NotificationDropdown = ({ theme, navPath }: NotificationDropdownProps) => {
  const [notifications, setNotifications] = useState<INotificationView[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const socket = useSocket();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?._id) {
        console.warn("No user ID, skipping fetchNotifications");
        return;
      }
      try {
        console.log("Fetching notifications for user:", user._id);
        const response = await NotificationServices.getLastFiveNotifications(user._id);
        const fetchedNotifications = response.data.map((n: INotificationView) => ({
          ...n,
          date: new Date(n.date),
        }));
        setNotifications(fetchedNotifications);
        setUnreadCount(fetchedNotifications.filter((n: INotificationView) => !n.isRead).length);
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
      socket.on(chatEnum.receiveNotification, (notification: INotificationView) => {
        console.log("Frontend received notification:", notification);
        toast.success("New Notification: " + notification.text);
        setNotifications((prev) => [
          { ...notification, date: new Date(notification.date) },
          ...prev,
        ]);
        if (!notification.isRead) {
          setUnreadCount((prev) => prev + 1);
        }
      });

      socket.on("adminNotification", (notification: INotificationView) => {
        console.log("Frontend received admin notification:", notification);
        toast.success("New Admin Notification: " + notification.text);
        setNotifications((prev) => [
          { ...notification, date: new Date(notification.date) },
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

      return () => {
        socket.off(chatEnum.receiveNotification);
        socket.off("adminNotification");
      };
    }
  }, [socket, user]);

  const markAsRead = async (id: string) => {
    try {
      await NotificationServices.markAsRead(id);
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
    if (!user?._id) return;
    try {
      await NotificationServices.markAllAsRead(user._id);
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
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
      const deletedNotif = notifications.find((n) => n.id === id);
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const getNotificationIcon = (category: string) => {
    const iconClass = "w-4 h-4 drop-shadow-lg";
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
    return `${days}d ago`;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative rounded-lg transition-all duration-300 group",
            "hover:scale-110 hover:rotate-3",
            theme.glassmorphism,
            theme.border,
            theme.textSecondary,
            theme.hoverBackground
          )}
        >
          <Bell className="h-5 w-5 transition-all duration-300 group-hover:animate-pulse" />
          {unreadCount > 0 && (
            <Badge
              className={cn(
                "absolute -top-2 -right-2 px-1.5 py-0 text-xs rounded-full",
                "min-w-[20px] h-[20px] flex items-center justify-center",
                "border-2 transition-all duration-300 animate-pulse",
                theme.gradient,
                "text-white font-bold shadow-lg"
              )}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={cn(
          "w-80 sm:w-96 border-2 backdrop-blur-xl",
          theme.cardBackground,
          theme.border,
          theme.shadow
        )}
        align="end"
        sideOffset={8}
      >
        <style>{`
          .notification-glow {
            animation: notification-glow 2s ease-in-out infinite alternate;
          }
          @keyframes notification-glow {
            from { box-shadow: 0 0 5px currentColor; }
            to { box-shadow: 0 0 15px currentColor; }
          }
          .slide-in {
            animation: slide-in 0.3s ease-out;
          }
          @keyframes slide-in {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>

        <div className={cn(
          "flex items-center justify-between p-4 border-b slide-in",
          theme.border
        )}>
          <DropdownMenuLabel className={cn(
            "text-lg font-bold flex items-center gap-2",
            theme.textPrimary
          )}>
            <Bell className={cn("w-5 h-5", theme.primary)} />
            Notifications
            {unreadCount > 0 && (
              <Badge className={cn(
                "ml-2 px-2 py-1 text-xs",
                theme.gradient,
                "text-white notification-glow"
              )}>
                {unreadCount} new
              </Badge>
            )}
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className={cn(
                "text-xs h-8 transition-all duration-300 hover:scale-105",
                theme.glassmorphism,
                theme.primary,
                theme.primaryHover,
                theme.hoverBackground
              )}
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className={cn(
              "flex flex-col items-center justify-center py-12 slide-in",
              theme.textSecondary
            )}>
              <div className={cn(
                "p-4 rounded-full mb-4",
                theme.cardGradient
              )}>
                <Bell className="w-12 h-12 opacity-50" />
              </div>
              <p className={cn("text-sm font-medium mb-2", theme.textPrimary)}>
                No notifications yet
              </p>
              <p className={cn("text-xs text-center max-w-48", theme.textMuted)}>
                We'll notify you when something important happens
              </p>
            </div>
          ) : (
            notifications.map((notif, index) => (
              <DropdownMenuItem
                key={notif.id}
                className={cn(
                  "flex flex-col items-start gap-2 p-4 border-b cursor-default",
                  "transition-all duration-300 hover:scale-[1.02] slide-in",
                  theme.border,
                  theme.hoverBackground,
                  !notif.isRead && `${theme.cardGradient} border-l-4 ${theme.primary.replace('text-', 'border-')}`
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={(e) => e.preventDefault()}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1 transition-transform duration-300 hover:scale-110">
                      {getNotificationIcon(notif.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm leading-relaxed transition-all duration-300",
                        !notif.isRead
                          ? `font-semibold ${theme.textPrimary}`
                          : theme.textSecondary
                      )}>
                        {notif.text}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn("text-xs", theme.textMuted)}>
                          {formatTime(notif.date)}
                        </span>
                        {!notif.isRead && (
                          <Badge className={cn(
                            "text-xs px-1.5 py-0.5 notification-glow",
                            theme.gradient,
                            "text-white"
                          )}>
                            New
                          </Badge>
                        )}
                      </div>
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
                        className={cn(
                          "h-7 w-7 p-0 transition-all duration-300",
                          "hover:scale-110 hover:rotate-12",
                          theme.glassmorphism,
                          theme.success,
                          theme.hoverBackground
                        )}
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
                      className={cn(
                        "h-7 w-7 p-0 transition-all duration-300",
                        "hover:scale-110 hover:rotate-12",
                        theme.glassmorphism,
                        theme.error,
                        "hover:bg-red-900/30"
                      )}
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

        <DropdownMenuSeparator className={cn(theme.border)} />
        <div className="p-3">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-center transition-all duration-300",
              "hover:scale-105 slide-in",
              theme.glassmorphism,
              theme.primary,
              theme.primaryHover,
              theme.hoverBackground
            )}
            onClick={() => {
              setIsOpen(false);
              navigate(navPath);
            }}
          >
            <Bell className="w-4 h-4 mr-2" />
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;