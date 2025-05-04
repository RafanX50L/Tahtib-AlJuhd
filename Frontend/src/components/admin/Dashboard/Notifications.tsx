import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Notification {
  title: string;
  text: string;
  time: string;
  actions?: string[];
  isRead: boolean;
}

const Notifications = () => {
  const notifications: Notification[] = [
    {
      title: "System Update",
      text: "The system will undergo maintenance tonight at 2 AM EST. Expected downtime: 30 minutes.",
      time: "Just now",
      isRead: false,
    },
    {
      title: "Trainer Approval",
      text: "David Chen's documents are pending your approval.",
      time: "2 hours ago",
      actions: ["Review", "Later"],
      isRead: false,
    },
    {
      title: "Payment Issue",
      text: "Payment gateway reported 3 failed transactions. Check finance module for details.",
      time: "1 day ago",
      isRead: true,
    },
  ];

  return (
    <Card className="bg-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Notifications</h3>
        <span className="text-sm text-indigo-400 cursor-pointer hover:text-indigo-300">
          Mark all as read
        </span>
      </div>
      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className={`p-3 rounded-md ${
              notification.isRead ? "border border-gray-700" : "bg-gray-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-white font-medium">{notification.title}</p>
              <span className="text-xs text-gray-400">{notification.time}</span>
            </div>
            <p className="text-gray-300 text-sm mt-1">{notification.text}</p>
            {notification.actions && (
              <div className="mt-2 flex space-x-2">
                {notification.actions.map((action, idx) => (
                  <Button
                    key={idx}
                    className={`px-3 py-1 text-xs rounded ${
                      action === "Review"
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-gray-600 hover:bg-gray-500 text-white"
                    }`}
                  >
                    {action}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <Button className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white">
        View All Notifications
      </Button>
    </Card>
  );
};

export default Notifications;