import { Card } from "@/components/ui/card";
import { Users, User, DollarSign, Clock, ArrowUp, ArrowDown } from "lucide-react";

interface Stat {
  title: string;
  value: string;
  icon: string;
  trend: "up" | "down";
  trendValue: string;
  color: string;
}

const StatsCard = () => {
  const stats: Stat[] = [
    {
      title: "Total Trainers",
      value: "24",
      icon: "Users",
      trend: "up",
      trendValue: "8%",
      color: "indigo",
    },
    {
      title: "Active Clients",
      value: "142",
      icon: "User",
      trend: "up",
      trendValue: "12%",
      color: "green",
    },
    {
      title: "Monthly Revenue",
      value: "$18,652",
      icon: "DollarSign",
      trend: "up",
      trendValue: "15%",
      color: "blue",
    },
    {
      title: "Pending Trainer Approvals",
      value: "7",
      icon: "Clock",
      trend: "down",
      trendValue: "3",
      color: "yellow",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gray-800 p-6 hover:-translate-y-1 border-none transition-transform">
          <div className="flex items-center justify-between border-none">
            <div>
              <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
              <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 bg-${stat.color}-500 bg-opacity-20 rounded-full`}>
              {stat.icon === "Users" && <Users className={`w-6 h-6 text-${stat.color}-400`} />}
              {stat.icon === "User" && <User className={`w-6 h-6 text-${stat.color}-400`} />}
              {stat.icon === "DollarSign" && <DollarSign className={`w-6 h-6 text-${stat.color}-400`} />}
              {stat.icon === "Clock" && <Clock className={`w-6 h-6 text-${stat.color}-400`} />}
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center">
              {stat.trend === "up" ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              {stat.trendValue}
            </span>
            <span className="text-gray-400 ml-2">
              {stat.trend === "up" ? "From last month" : "New today"}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsCard;