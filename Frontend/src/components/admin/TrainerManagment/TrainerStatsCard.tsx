import { Card } from "@/components/ui/card";
import { Users, CheckCircle, Star } from "lucide-react";

interface Stat {
  title: string;
  value: string;
  icon: string;
  color: string;
  bgColor: string;
}

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Users,
  CheckCircle,
  Star,
};

const TrainerStatsCard = () => {
  const stats: Stat[] = [
    {
      title: "Total Approved Trainers",
      value: "3",
      icon: "Users",
      color: "text-indigo-300",
      bgColor: "bg-indigo-600",
    },
    {
      title: "Active Trainers",
      value: "2",
      icon: "CheckCircle",
      color: "text-green-300",
      bgColor: "bg-green-600",
    },
    {
      title: "Avg Trainer Rating",
      value: "4.7/5",
      icon: "Star",
      color: "text-blue-300",
      bgColor: "bg-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = iconMap[stat.icon];
        return (
          <Card
            key={index}
            className="bg-gray-800 border-none rounded-lg p-6 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
                <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 ${stat.bgColor} rounded-full`}>
                {IconComponent && <IconComponent className={`w-6 h-6 ${stat.color}`} />}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default TrainerStatsCard;