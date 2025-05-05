import { Card } from "@/components/ui/card";
import { Users, CheckCircle, UserCheck, DollarSign } from "lucide-react";

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
  UserCheck,
  DollarSign,
};

const StatsCard = () => {
  const stats: Stat[] = [
    {
      title: "Total Clients",
      value: "120",
      icon: "Users",
      color: "text-indigo-300",
      bgColor: "bg-indigo-600",
    },
    {
      title: "Active Clients",
      value: "105",
      icon: "CheckCircle",
      color: "text-green-300",
      bgColor: "bg-green-600",
    },
    {
      title: "One-to-One Clients",
      value: "45",
      icon: "UserCheck",
      color: "text-purple-300",
      bgColor: "bg-purple-600",
    },
    {
      title: "Total Revenue",
      value: "$15,600",
      icon: "DollarSign",
      color: "text-blue-300",
      bgColor: "bg-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

export default StatsCard;