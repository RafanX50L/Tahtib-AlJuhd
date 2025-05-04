import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import * as Icons from "lucide-react";
import React from "react";

interface Activity {
  icon: keyof typeof Icons;
  iconColor: string;
  text: string;
  time: string;
}

const RecentActivities = ({ className }: { className?: string }) => {
  const activities: Activity[] = [
    {
      icon: "UserPlus",
      iconColor: "indigo",
      text: "New client registration: <span class='font-medium'>Emma Watson</span>",
      time: "15 minutes ago",
    },
    {
      icon: "DollarSign",
      iconColor: "green",
      text: "Payment received: <span class='font-medium'>$120</span> from <span class='font-medium'>John Davis</span>",
      time: "42 minutes ago",
    },
    {
      icon: "Calendar",
      iconColor: "blue",
      text: "Trainer <span class='font-medium'>Robert Wilson</span> updated workout plan for <span class='font-medium'>Alex Johnson</span>",
      time: "1 hour ago",
    },
    {
      icon: "MessageSquare",
      iconColor: "purple",
      text: "New message from <span class='font-medium'>Sarah Miller</span> regarding interview",
      time: "2 hours ago",
    },
    {
      icon: "Star",
      iconColor: "yellow",
      text: "New review: <span class='font-medium'>5 stars</span> for trainer <span class='font-medium'>Jennifer Lee</span>",
      time: "3 hours ago",
    },
  ];

  return (
    <Card className={`bg-gray-800 p-6 ${className}`}>
      <h3 className="text-lg font-bold text-white mb-4">Recent Activities</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex">
            <div
              className={`flex-shrink-0 h-10 w-10 rounded-full bg-${activity.iconColor}-500 bg-opacity-20 flex items-center justify-center`}
            >
              {React.createElement(Icons[activity.icon], {
                className: `text-${activity.iconColor}-400 w-5 h-5`,
              })}
            </div>
            <div className="ml-4">
              <p
                className="text-white"
                dangerouslySetInnerHTML={{ __html: activity.text }}
              />
              <p className="text-gray-400 text-sm">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <Button className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white">
        View All Activities
      </Button>
    </Card>
  );
};

export default RecentActivities;